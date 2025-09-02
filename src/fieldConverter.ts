import { QueryBase } from './types';
import { ID_FIELD, TO_LABEL_FUNCTION, FIELD_TYPES } from './constants';
import { getQuery } from './queryConverter';

/**
 * Converts a SOQL field to GraphQL format
 * @param field - The SOQL field to convert
 * @returns GraphQL-compatible field object
 * @throws {Error} When field is invalid
 */
export function getField(
  field: unknown
): Record<string, unknown> | boolean | string {
  if (!field) {
    throw new Error('Invalid field: field is required');
  }

  const fieldObj = field as {
    type?: string;
    field?: string;
    functionName?: string;
    parameters?: unknown[];
    subquery?: unknown;
    [key: string]: unknown;
  };
  const { type, ...other } = fieldObj;

  if (type === FIELD_TYPES.FIELD_RELATIONSHIP) {
    return {
      [fieldObj.field || 'unknown']: getField(other),
    };
  }

  if (fieldObj.field) {
    if (fieldObj.field === ID_FIELD) {
      return true;
    }
    return {
      value: true,
    };
  }

  if (fieldObj.functionName && fieldObj.parameters) {
    if (fieldObj.functionName === TO_LABEL_FUNCTION) {
      return {
        label: true,
      };
    }
    return {
      label: true,
    };
  }

  if (fieldObj.type === FIELD_TYPES.FIELD_SUBQUERY) {
    return getQuery(fieldObj.subquery as QueryBase);
  }

  return '';
}

/**
 * Converts SOQL fields to GraphQL query node format
 * @param parsedQuery - The parsed SOQL query
 * @returns GraphQL-compatible query node object
 */
export function getQueryNode(parsedQuery: QueryBase): Record<string, unknown> {
  if (!parsedQuery.fields) {
    return {};
  }

  return parsedQuery.fields.reduce(
    (prev: Record<string, unknown>, cur: unknown) => {
      const curObj = cur as {
        relationships?: string[];
        field?: string;
        subquery?: { relationshipName?: string };
        parameters?: unknown[];
      };
      const key =
        (curObj.relationships && curObj.relationships[0]) ||
        curObj.field ||
        curObj.subquery?.relationshipName ||
        (curObj.parameters && curObj.parameters[0]);

      if (key && typeof key === 'string') {
        prev[key] = getField(cur);
      }
      return prev;
    },
    {}
  );
}
