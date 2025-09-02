import { ComparisonOperator, OrderDirection } from './types';

// Operator mapping from SOQL to GraphQL
export const OPERATOR_MAPPING: Record<string, ComparisonOperator> = {
    '=': 'eq',
    '!=': 'ne',
    'like': 'like',
    'in': 'in',
    '>': 'gt',
    '>=': 'gte',
    '<': 'lt',
    '<=': 'lte'
} as const;

// Default values
export const DEFAULT_OPERATOR: ComparisonOperator = 'eq';
export const DEFAULT_ORDER: OrderDirection = 'ASC';

// Field and function names
export const ID_FIELD = 'Id';
export const TO_LABEL_FUNCTION = 'toLabel';

// GraphQL field types
export const FIELD_TYPES = {
    FIELD_RELATIONSHIP: 'FieldRelationship',
    FIELD_SUBQUERY: 'FieldSubquery'
} as const;

// Literal types
export const LITERAL_TYPES = {
    BOOLEAN: 'BOOLEAN',
    INTEGER: 'INTEGER',
    APEX_BIND_VARIABLE: 'APEX_BIND_VARIABLE'
} as const;
