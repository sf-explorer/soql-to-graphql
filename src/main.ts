import converter, { TInput } from './converter'
import { parseQuery } from '@jetstreamapp/soql-parser-js'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'



export default function soql2graphql(q: string, variables?: TInput) {
    const parseResult = parseQuery(q, {allowApexBindVariables: true} );
    const jsonQ = converter(parseResult, variables)
    return jsonToGraphQLQuery(jsonQ, { pretty: true }).replaceAll('"ASC"', 'ASC').replaceAll('"DESC"', 'DESC')
}