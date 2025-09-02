import { Query, QueryBase, TInput } from './types';
import { DEFAULT_ORDER } from './constants';
import { getWhereCond } from './whereConverter';
import { getQueryNode } from './fieldConverter';

/**
 * Converts SOQL query arguments to GraphQL format
 * @param parsedQuery - The parsed SOQL query
 * @param input - Optional input variables for bind variables
 * @returns GraphQL-compatible arguments object
 */
export function getArgs(
  parsedQuery: Query,
  input?: TInput
): Record<string, unknown> {
  const res: Record<string, unknown> = {};

  if (parsedQuery.limit) {
    res.first = parsedQuery.limit;
  }
  if (parsedQuery.where) {
    res.where = getWhereCond(parsedQuery.where, input);
  }
  if (parsedQuery.orderBy) {
    const orderByArray = Array.isArray(parsedQuery.orderBy)
      ? parsedQuery.orderBy
      : [parsedQuery.orderBy];
    if (orderByArray.length > 0) {
      const firstOrderBy = orderByArray[0];
      // Handle both OrderByFieldClause and OrderByFnClause
      let fieldName = 'unknown';
      if ('field' in firstOrderBy && typeof firstOrderBy.field === 'string') {
        fieldName = firstOrderBy.field;
      } else if (
        'functionName' in firstOrderBy &&
        typeof firstOrderBy.functionName === 'string'
      ) {
        fieldName = firstOrderBy.functionName;
      } else if (
        'orderByField' in firstOrderBy &&
        typeof firstOrderBy.orderByField === 'string'
      ) {
        fieldName = firstOrderBy.orderByField;
      }
      res.orderBy = {
        [fieldName]: { order: firstOrderBy.order || DEFAULT_ORDER },
      };
    }
  }

  return res;
}

/**
 * Converts a SOQL query to GraphQL format
 * @param parsedQuery - The parsed SOQL query
 * @param input - Optional input variables for bind variables
 * @returns GraphQL-compatible query object
 */
export function getQuery(
  parsedQuery: QueryBase,
  input?: TInput
): Record<string, unknown> {
  const pageInfo = parsedQuery.limit
    ? {
        pageInfo: {
          endCursor: true,
          hasNextPage: true,
          hasPreviousPage: true,
        },
      }
    : {};

  return {
    __args: getArgs(parsedQuery, input),
    edges: {
      node: getQueryNode(parsedQuery),
    },
    ...pageInfo,
  };
}
