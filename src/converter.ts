
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

/*
to do
function getWhereField(cond: any) {
    let value: any

    if (cond.literalType === 'INTEGER') {
        value = parseInt(cond.value)
    } else {
        value = JSON.stringify(cond.value).replaceAll("'", "")
    }

    return `${cond.field}: { ${getWhereOperator(cond)} : ${value} }  `
}*/

function getField(field: any): any {
    const { type } = field
    if (type === "FieldRelationship") {
        // to do
        return true
    }
    if (field.field) {
        if (field.field === "Id") {
            return true
        }
        return {
            value: true
        }
    }
    if (field.functionName?.toLowerCase() === 'tolabel' && field.parameters) {
        // todo
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

function getWhereClause(parsedQuery: any) {
    const res: any = {

    }
    if (parsedQuery.limit) {
        res.first = parsedQuery.limit
    }
    return res
}

function getQueryNode(parsedQuery: any): any {

    return parsedQuery.fields?.reduce((prev, cur) => {
        prev[cur.field || cur.subquery?.relationshipName] = getField(cur)
        return prev
    }, {})

}

function getQuery(parsedQuery: any): any {

    return {
        __args: getWhereClause(parsedQuery),
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
                    [parsedQuery.sObject || parsedQuery.relationshipName]:  getQuery(parsedQuery)
                }
            }
        }
    }
}