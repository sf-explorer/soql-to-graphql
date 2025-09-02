import { Query, QueryBase, ValueCondition } from "@jetstreamapp/soql-parser-js";

// Type definitions for SOQL to GraphQL conversion
export type ComparisonOperator = 'eq' | 'ne' | 'like' | 'in' | 'gt' | 'gte' | 'lt' | 'lte';
export type LogicalOperator = 'and' | 'or';
export type OrderDirection = 'ASC' | 'DESC';

export interface TInput {
    [prop: string]: string
}

// Re-export commonly used types from the SOQL parser
export type { Query, QueryBase, ValueCondition };
