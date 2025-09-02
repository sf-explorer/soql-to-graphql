import transform from './converter';
import { VariableDefinitions } from './types';
import { parseQuery } from '@jetstreamapp/soql-parser-js';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

export default function soql2graphql(
  q: string,
  variables?: VariableDefinitions
): string {
  if (!q || typeof q !== 'string') {
    throw new Error('SOQL query string is required');
  }

  const parseResult = parseQuery(q, { allowApexBindVariables: true });
  const jsonQ = transform(parseResult, variables);
  return jsonToGraphQLQuery(jsonQ, { pretty: true })
    .replaceAll('"ASC"', 'ASC')
    .replaceAll('"DESC"', 'DESC');
}
