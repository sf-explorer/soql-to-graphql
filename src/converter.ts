import { VariableType } from "json-to-graphql-query"
import { Query, QueryBase, ValueCondition } from "soql-parser-js"

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

function getWhereField(cond: ValueCondition, input?: any) {
    let value: any
    
    if (cond.literalType === 'INTEGER' && typeof cond.value === 'string') {
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

function getWhereCond(cond: any, input?: any) {

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

function getField(field: any): any {
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
        return {
            [field.parameters[0]]: {
                display: true
            }
        }
    }

    if (field.type === "FieldSubquery") {
        return getQuery(field.subquery)
    }
    return ''
}

function getArgs(parsedQuery: Query, input?: any) {

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

function getQueryNode(parsedQuery: QueryBase): any {

    return parsedQuery.fields?.reduce((prev, cur: any) => {
        prev[(cur.relationships && cur.relationships[0]) || cur.field || cur.subquery?.relationshipName || (cur.parameters && cur.parameters[0])] = getField(cur)
        return prev
    }, {})

}

function getQuery(parsedQuery: QueryBase, input?: any): any {

    return {
        __args: getArgs(parsedQuery, input),
        edges: {
            node: getQueryNode(parsedQuery)
        }
    }
}


export default function transfrom(parsedQuery: Query, input?: any): object {
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