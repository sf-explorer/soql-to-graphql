
export function getWhereOperator(cond: any): string {
    switch (cond.operator) {
        case '=':
            return 'eq'
        case '!=':
            return 'neq'
        case 'like':
            return 'like'
        case 'IN':
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


function getWhereField(cond: any) {
    let value: any


    if (cond.literalType === 'INTEGER') {
        value = parseInt(cond.value)
    } else {
        value = JSON.stringify(cond.value).replaceAll('"', "").replaceAll("'", "")
    }

    return {
        [cond.field]: { [getWhereOperator(cond)]: value }
    }
}

function getWhereCond(cond: any) {

    if (cond.operator && cond.left && cond.right) {

        return {
            [cond.operator]: {
                'left': getWhereCond(cond.left),
                'right': getWhereCond(cond.right),
            }
        }
    } else {

        return getWhereField(cond.left || cond)
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

function getArgs(parsedQuery: any) {
    const res: any = {

    }
    if (parsedQuery.limit) {
        res.first = parsedQuery.limit
    }
    if (parsedQuery.where) {
        res.where = getWhereCond(parsedQuery.where)
    }
    if (parsedQuery.orderBy) {

        const fieldName = parsedQuery.orderBy[0].field
        res.orderBy = fieldName
    }
    return res
}

function getQueryNode(parsedQuery: any): any {

    return parsedQuery.fields?.reduce((prev, cur) => {
        prev[(cur.relationships && cur.relationships[0]) || cur.field || cur.subquery?.relationshipName || (cur.parameters && cur.parameters[0])] = getField(cur)
        return prev
    }, {})

}

function getQuery(parsedQuery: any): any {

    return {
        __args: getArgs(parsedQuery),
        edges: {
            node: getQueryNode(parsedQuery)
        }
    }
}


export default function transfrom(parsedQuery: any): object {
    //const input = fullQuery.indexOf('$recordIds') > -1 ? '($recordIds: [ID])' : (fullQuery.indexOf('$recordId') > -1 ? '($recordId: ID)' : '')

    return {
        query: {
            uiapi: {
                query: {
                    [parsedQuery.sObject || parsedQuery.relationshipName]: getQuery(parsedQuery)
                }
            }
        }
    }
}