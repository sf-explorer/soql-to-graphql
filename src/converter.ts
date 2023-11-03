
function getWhereOperator(cond: any): string {
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
        value = JSON.stringify(cond.value).replaceAll("'", "")
    }

    return `${cond.field}: { ${getWhereOperator(cond)} : ${value} }  `
}

function getField(field: any): string {
    const { type, ...rawField } = field
    if (type === "FieldRelationship") {

        return (
            `                    ${field.relationships[0]} {
                        ${getField(rawField)}
                    }`
        )
    }
    if (field.field) {
        if (field.field === "Id") {
            return field.field
        }
        return (
            `                    ${field.field} {
                        value
                    }`
        )
    }
    if (field.functionName?.toLowerCase() === 'tolabel' && field.parameters) {
        return (
            `                    ${field.parameters[0]} {
                        display
                    }`
        )
    }

    if (field.type === "FieldSubquery") {
        return getQuery(field.subquery)
    }
    return ''
}

function getWhereClause(parsedQuery: any) {
    if (!parsedQuery.where && parsedQuery.limit) return `(first: ${parsedQuery.limit})`

    if (!parsedQuery.where) return ''

    return `(${parsedQuery.limit ? `first: ${parsedQuery.limit},` : ''}
        where: { ${getWhereField(parsedQuery.where.left)} }
        ) `

}

function getQuery(parsedQuery: any) {

    return ` ${parsedQuery.sObject || parsedQuery.relationshipName} ${getWhereClause(parsedQuery)} {
        edges {
          node {
${parsedQuery.fields?.map(getField).join('\n')}
          }
        }
      }`

}


export default function transfrom(parsedQuery: any, fullQuery: string): string {
    const input = fullQuery.indexOf('$recordIds') > -1 ? '($recordIds: [ID])' : (fullQuery.indexOf('$recordId') > -1 ? '($recordId: ID)' : '')

    return `query ${parsedQuery.sObject}s${input} {
        uiapi {
          query {
            ${getQuery(parsedQuery)}
          }
        }
      }`
}