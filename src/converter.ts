import { VariableType } from "json-to-graphql-query"
import { Query, QueryBase, ValueCondition } from "@jetstreamapp/soql-parser-js"

export interface TInput {
    [prop: string]: string
}

export function getWhereOperator(cond: ValueCondition): string {
    switch (cond.operator.toLowerCase()) {
        case '=':
            return 'eq'
        case '!=':
            return 'neq'
        case 'like':
            return 'like'
        case 'in':
            return 'in'
        case '>':
            return 'gt'
        case '>=':
            return 'gte'
        case '<':
            return 'lt'
        case '<=':
            return 'lte'
        default:
            return 'eq'
    }
}

function getWhereField(cond: ValueCondition, input?: TInput) {

    if(cond.field.includes('.')) {
        const [outer, ...rest] = cond.field.split('.');
        return {
            [outer]: {...getWhereField({...cond, field: rest.join('.')}, input)}
        };
    }

    let value: any;
    if (cond.literalType === 'BOOLEAN' && typeof cond.value === 'string') {
        value =  cond.value === 'TRUE'
    } else if (cond.literalType === 'INTEGER' && typeof cond.value === 'string') {
        value = parseInt(cond.value)
    } else if (Array.isArray(cond.value)) {
        value = cond.value.map(item => JSON.stringify(item).replaceAll('"', "").replaceAll("'", ""))
    }
    else {
        value = JSON.stringify(cond.value).replaceAll('"', "").replaceAll("'", "")
        if (input && (value[0] === ':' || cond.literalType === 'APEX_BIND_VARIABLE')) {
            const key = value.replace(":", "")
            if (input[key]) {
                value = new VariableType(key)
            }
        }
    }
    return {
        [cond.field]: { [getWhereOperator(cond)]: value }
    }
}

function getWhereCond(cond: any, input?: TInput) {

    if (cond.operator && cond.left && cond.right) {
        return {
            [cond.operator.toLowerCase()]: [
                getWhereCond(cond.left, input),
                getWhereCond(cond.right, input)
            ]
        }
    } else {
        return getWhereField(cond.left || cond, input)
    }

}

function getField(field: any): object | boolean | string {
    const { type, ...other } = field
    if (type === "FieldRelationship") {
        return {
            [field.field]: getField(other)
        }
    }
    if (field.field) {
        if (field.field === "Id") {
            return true
        }
        return {
            value: true
        }
    }
    if (field.functionName && field.parameters) {
        if (field.functionName === 'toLabel') {
            return {
                label: true
            }
        }
        return {
            label: true
        }

    }

    if (field.type === "FieldSubquery") {
        return getQuery(field.subquery)
    }
    return ''
}

function getArgs(parsedQuery: Query, input?: TInput) {

    const res: any = {

    }
    if (parsedQuery.limit) {
        res.first = parsedQuery.limit
    }
    if (parsedQuery.where) {
        res.where = getWhereCond(parsedQuery.where, input)
    }
    if (parsedQuery.orderBy) {
        const fieldName = parsedQuery.orderBy[0].field
        res.orderBy = {
            [fieldName]: { order: parsedQuery.orderBy[0].order || "ASC" }
        }
    }

    return res
}

function getQueryNode(parsedQuery: QueryBase): object {

    return parsedQuery.fields?.reduce((prev, cur: any) => {
        prev[(cur.relationships && cur.relationships[0]) || cur.field || cur.subquery?.relationshipName || (cur.parameters && cur.parameters[0])] = getField(cur)
        return prev
    }, {})

}

function getQuery(parsedQuery: QueryBase, input?: TInput): object {

    return {
        __args: getArgs(parsedQuery, input),
        edges: {
            node: getQueryNode(parsedQuery)
        }
    }
}


export default function transfrom(parsedQuery: Query, input?: TInput): object {
    return {
        query: {
            __variables: input,
            uiapi: {
                query: {
                    [parsedQuery.sObject]: getQuery(parsedQuery, input)
                }
            }
        }
    }
}