import converter from './converter'
import { parseQuery } from 'soql-parser-js'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'


export default function soql2graphql(q: string, variables?: any) {
    const parseResult = parseQuery(q, {allowApexBindVariables: true} );
    const jsonQ = converter(parseResult, variables)
    return jsonToGraphQLQuery(jsonQ, { pretty: true }).replaceAll('"ASC"', 'ASC').replaceAll('"DESC"', 'DESC')
}