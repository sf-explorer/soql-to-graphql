/**
 * Test utilities for SOQL to GraphQL conversion tests
 */

/**
 * Creates a mock SOQL condition for testing
 * @param {Object} overrides - Properties to override in the default condition
 * @returns {Object} Mock condition object
 */
function createMockCondition(overrides = {}) {
  return {
    field: 'Name',
    operator: '=',
    value: 'Test',
    literalType: 'STRING',
    ...overrides
  };
}

/**
 * Creates a mock SOQL field for testing
 * @param {Object} overrides - Properties to override in the default field
 * @returns {Object} Mock field object
 */
function createMockField(overrides = {}) {
  return {
    field: 'Name',
    ...overrides
  };
}

/**
 * Creates a mock parsed SOQL query for testing
 * @param {Object} overrides - Properties to override in the default query
 * @returns {Object} Mock parsed query object
 */
function createMockQuery(overrides = {}) {
  return {
    sObject: 'Account',
    fields: [
      { field: 'Id' },
      { field: 'Name' }
    ],
    ...overrides
  };
}

/**
 * Validates that a GraphQL result contains expected structure
 * @param {string} result - The GraphQL query string result
 * @param {Object} expected - Expected content to validate
 */
function validateGraphQLStructure(result, expected = {}) {
  expect(result).toContain('query');
  expect(result).toContain('uiapi');
  
  if (expected.sObject) {
    expect(result).toContain(expected.sObject);
  }
  
  if (expected.fields) {
    expected.fields.forEach(field => {
      expect(result).toContain(field);
    });
  }
  
  if (expected.hasWhere) {
    expect(result).toContain('where');
  }
  
  if (expected.hasLimit) {
    expect(result).toContain('first');
    expect(result).toContain('pageInfo');
  }
  
  if (expected.hasOrderBy) {
    expect(result).toContain('orderBy');
  }
  
  if (expected.hasVariables) {
    // Variables are now in the GraphQL query parameters, not __variables
    expect(result).toMatch(/\$[a-zA-Z_][a-zA-Z0-9_]*:/);
  }
}

/**
 * Creates test data for different SOQL scenarios
 */
const testData = {
  simpleQueries: [
    'SELECT Id FROM Account',
    'SELECT Id, Name FROM Contact',
    'SELECT Id, Name, Email FROM Lead'
  ],
  
  queriesWithWhere: [
    "SELECT Id FROM Account WHERE Name = 'Test'",
    "SELECT Id FROM Contact WHERE Email = 'test@example.com'",
    "SELECT Id FROM Lead WHERE Status = 'New'"
  ],
  
  queriesWithLimit: [
    'SELECT Id FROM Account LIMIT 10',
    'SELECT Id FROM Contact LIMIT 100',
    'SELECT Id FROM Lead LIMIT 1'
  ],
  
  queriesWithOrderBy: [
    'SELECT Id FROM Account ORDER BY Name ASC',
    'SELECT Id FROM Contact ORDER BY CreatedDate DESC',
    'SELECT Id FROM Lead ORDER BY Name ASC, Email DESC'
  ],
  
  complexQueries: [
    "SELECT Id, Name, Owner.Name FROM Account WHERE Industry = 'Technology' LIMIT 50",
    "SELECT Id, (SELECT Id FROM Opportunities) FROM Account WHERE Name LIKE '%Test%'",
    'SELECT COUNT(Id) FROM Contact WHERE IsActive = true'
  ]
};

/**
 * Performance testing utilities
 */
const performanceUtils = {
  /**
   * Measures execution time of a function
   * @param {Function} fn - Function to measure
   * @param {Array} args - Arguments to pass to the function
   * @returns {Object} Performance metrics
   */
  measureExecutionTime(fn, args = []) {
    const start = process.hrtime.bigint();
    const result = fn(...args);
    const end = process.hrtime.bigint();
    
    return {
      result,
      executionTime: Number(end - start) / 1000000, // Convert to milliseconds
      memoryUsage: process.memoryUsage()
    };
  },
  
  /**
   * Runs a function multiple times and returns average metrics
   * @param {Function} fn - Function to benchmark
   * @param {Array} args - Arguments to pass to the function
   * @param {number} iterations - Number of iterations to run
   * @returns {Object} Average performance metrics
   */
  benchmark(fn, args = [], iterations = 100) {
    const times = [];
    const memoryUsages = [];
    
    for (let i = 0; i < iterations; i++) {
      const metrics = this.measureExecutionTime(fn, args);
      times.push(metrics.executionTime);
      memoryUsages.push(metrics.memoryUsage.heapUsed);
    }
    
    return {
      averageTime: times.reduce((a, b) => a + b, 0) / times.length,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
      averageMemory: memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length
    };
  }
};

module.exports = {
  createMockCondition,
  createMockField,
  createMockQuery,
  validateGraphQLStructure,
  testData,
  performanceUtils
};
