// Main export
export { default as soql2graphql } from './main';

// Type exports
export type {
  VariableDefinitions,
  ComparisonOperator,
  LogicalOperator,
  OrderDirection,
  Query,
  QueryBase,
  ValueCondition,
} from './types';

// Function exports
export { getWhereOperator } from './operators';
export { default as transform } from './converter';
export { getArgs, getQuery } from './queryConverter';
export { getField, getQueryNode } from './fieldConverter';
export { getWhereField, getWhereCond } from './whereConverter';

// Constant exports
export {
  FIELD_TYPES,
  LITERAL_TYPES,
  OPERATOR_MAPPING,
  DEFAULT_OPERATOR,
  DEFAULT_ORDER,
  ID_FIELD,
  TO_LABEL_FUNCTION,
} from './constants';
