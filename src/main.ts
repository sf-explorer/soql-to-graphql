import converter from './converter'
import { parseQuery } from 'soql-parser-js';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';




export default function soql2graphql(q: string) {
    const parseResult = parseQuery(q);
    const jsonQ = converter(parseResult)
    return jsonToGraphQLQuery(jsonQ, { pretty: true });
    
}