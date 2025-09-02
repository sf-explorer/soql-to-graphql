import { Query, TInput } from './types';
import { getQuery } from './queryConverter';

/**
 * Main function to transform a parsed SOQL query into GraphQL format
 * @param parsedQuery - The parsed SOQL query
 * @param input - Optional input variables for bind variables
 * @returns GraphQL-compatible query object
 * @throws {Error} When parsed query is invalid or missing required fields
 */
export default function transform(
  parsedQuery: Query,
  input?: TInput
): Record<string, unknown> {
  if (!parsedQuery) {
    throw new Error('Parsed query is required');
  }

  if (!parsedQuery.sObject) {
    throw new Error('SOQL query must specify an sObject');
  }

  return {
    query: {
      __variables: input,
      uiapi: {
        query: {
          [parsedQuery.sObject]: getQuery(parsedQuery, input),
        },
      },
    },
  };
}

// Re-export types and functions for backward compatibility
export { TInput } from './types';
export { getWhereOperator } from './operators';
