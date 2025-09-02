import { ValueCondition, ComparisonOperator } from './types';
import { OPERATOR_MAPPING, DEFAULT_OPERATOR } from './constants';

/**
 * Converts a SOQL operator to its GraphQL equivalent
 * @param cond - The SOQL condition containing the operator
 * @returns The corresponding GraphQL operator
 */
export function getWhereOperator(cond: ValueCondition): ComparisonOperator {
  return OPERATOR_MAPPING[cond.operator.toLowerCase()] || DEFAULT_OPERATOR;
}
