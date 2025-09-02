import { VariableType } from 'json-to-graphql-query';
import { ValueCondition, TInput } from './types';
import { LITERAL_TYPES } from './constants';
import { getWhereOperator } from './operators';

/**
 * Converts a SOQL WHERE field condition to GraphQL format
 * @param cond - The SOQL condition to convert
 * @param input - Optional input variables for bind variables
 * @returns GraphQL-compatible condition object
 * @throws {Error} When condition is invalid or missing required fields
 */
export function getWhereField(
  cond: ValueCondition,
  input?: TInput
): Record<string, unknown> {
  if (!cond || !cond.field) {
    throw new Error('Invalid condition: field is required');
  }

  if (cond.field.includes('.')) {
    const [outer, ...rest] = cond.field.split('.');
    return {
      [outer]: { ...getWhereField({ ...cond, field: rest.join('.') }, input) },
    };
  }

  let value: unknown;
  if (
    cond.literalType === LITERAL_TYPES.BOOLEAN &&
    typeof cond.value === 'string'
  ) {
    value = cond.value === 'TRUE';
  } else if (
    cond.literalType === LITERAL_TYPES.INTEGER &&
    typeof cond.value === 'string'
  ) {
    value = parseInt(cond.value);
  } else if (Array.isArray(cond.value)) {
    value = cond.value.map(item => JSON.stringify(item).replace(/["']/g, ''));
  } else {
    value = JSON.stringify(cond.value).replace(/["']/g, '');
    if (
      input &&
      typeof value === 'string' &&
      (value[0] === ':' ||
        cond.literalType === LITERAL_TYPES.APEX_BIND_VARIABLE)
    ) {
      const key = value.replace(':', '');
      if (input[key]) {
        value = new VariableType(key);
      }
    }
  }
  return {
    [cond.field]: { [getWhereOperator(cond)]: value },
  };
}

/**
 * Converts a SOQL WHERE condition (including logical operators) to GraphQL format
 * @param cond - The SOQL condition to convert
 * @param input - Optional input variables for bind variables
 * @returns GraphQL-compatible condition object
 * @throws {Error} When condition is invalid
 */
export function getWhereCond(
  cond: unknown,
  input?: TInput
): Record<string, unknown> {
  if (!cond) {
    throw new Error('Invalid condition: condition is required');
  }

  const condition = cond as {
    operator?: string;
    left?: unknown;
    right?: unknown;
  };

  if (condition.operator && condition.left && condition.right) {
    return {
      [condition.operator.toLowerCase()]: [
        getWhereCond(condition.left, input),
        getWhereCond(condition.right, input),
      ],
    };
  } else {
    return getWhereField((condition.left || cond) as ValueCondition, input);
  }
}
