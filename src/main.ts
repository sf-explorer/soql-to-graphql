import transform from './converter';
import { TInput } from './types';
import { parseQuery } from '@jetstreamapp/soql-parser-js';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

export default function soql2graphql(q: string, variables?: TInput): string {
  if (!q || typeof q !== 'string') {
    throw new Error('SOQL query string is required');
  }

  const parseResult = parseQuery(q, { allowApexBindVariables: true });
  const jsonQ = transform(parseResult, variables);
  return jsonToGraphQLQuery(jsonQ, { pretty: true })
    .replaceAll('"ASC"', 'ASC')
    .replaceAll('"DESC"', 'DESC');
}
