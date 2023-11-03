import converter from './converter'
import { parseQuery } from 'soql-parser-js';


export default function soql2graphql(q: string) {
    const parseResult = parseQuery(q);
    return converter(parseResult, q)
}