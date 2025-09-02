const converter = require('../build/src/main.js').default;
const { testData, performanceUtils } = require('./testUtils');

describe('Performance Tests', () => {
  describe('Basic Performance', () => {
    it('should convert simple queries quickly', () => {
      const simpleQuery = 'SELECT Id, Name FROM Account';
      const metrics = performanceUtils.measureExecutionTime(converter, [
        simpleQuery,
      ]);

      expect(metrics.executionTime).toBeLessThan(100); // Should complete in under 100ms
      expect(metrics.result).toBeDefined();
    });

    it('should handle complex queries efficiently', () => {
      const complexQuery = `
        SELECT Id, Name, Owner.Name, 
               (SELECT Id, Name FROM Opportunities WHERE StageName = 'Closed Won'),
               (SELECT Id, Subject FROM Cases WHERE Status = 'Open')
        FROM Account
        WHERE Industry = 'Technology' AND CreatedDate >= 2023-01-01
        ORDER BY Name ASC
        LIMIT 100
      `;

      const metrics = performanceUtils.measureExecutionTime(converter, [
        complexQuery,
      ]);

      expect(metrics.executionTime).toBeLessThan(200); // Should complete in under 200ms
      expect(metrics.result).toBeDefined();
    });
  });

  describe('Benchmark Tests', () => {
    it('should maintain consistent performance across multiple runs', () => {
      const query =
        "SELECT Id, Name FROM Account WHERE Industry = 'Technology' LIMIT 10";
      const benchmark = performanceUtils.benchmark(converter, [query], 50);

      expect(benchmark.averageTime).toBeLessThan(50); // Average under 50ms
      expect(benchmark.maxTime).toBeLessThan(100); // Max under 100ms
      expect(benchmark.minTime).toBeGreaterThan(0); // Min should be positive
    });

    it('should handle variable binding efficiently', () => {
      const query =
        'SELECT Id FROM Account WHERE Name = :name AND Industry = :industry';
      const variables = { name: 'String', industry: 'String' };

      const benchmark = performanceUtils.benchmark(
        converter,
        [query, variables],
        30
      );

      expect(benchmark.averageTime).toBeLessThan(60);
      expect(benchmark.maxTime).toBeLessThan(120);
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory with repeated conversions', () => {
      const query = 'SELECT Id, Name FROM Account';
      const initialMemory = process.memoryUsage().heapUsed;

      // Run conversion multiple times
      for (let i = 0; i < 100; i++) {
        converter(query);
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 200MB for 100 iterations)
      expect(memoryIncrease).toBeLessThan(200 * 1024 * 1024);
    });

    it('should handle large result sets efficiently', () => {
      const largeQuery = `
        SELECT Id, Name, Description, Industry, Type, Owner.Name, Owner.Email,
               BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry,
               ShippingStreet, ShippingCity, ShippingState, ShippingPostalCode, ShippingCountry,
               Phone, Fax, Website, AnnualRevenue, NumberOfEmployees, Sic, SicDesc,
               DunsNumber, Tradestyle, NaicsCode, NaicsDesc, YearStarted, Ownership,
               Rating, CustomerPriority__c, SLA__c, Active__c, NumberofLocations__c,
               UpsellOpportunity__c, SLASerialNumber__c, SLAExpirationDate__c
        FROM Account
        WHERE Industry = 'Technology'
        LIMIT 1000
      `;

      const metrics = performanceUtils.measureExecutionTime(converter, [
        largeQuery,
      ]);

      expect(metrics.executionTime).toBeLessThan(500); // Should complete in under 500ms
      expect(metrics.memoryUsage.heapUsed).toBeLessThan(500 * 1024 * 1024); // Less than 500MB
    });
  });

  describe('Stress Tests', () => {
    it('should handle rapid successive conversions', () => {
      const queries = testData.simpleQueries;
      const start = Date.now();

      // Convert 1000 queries rapidly
      for (let i = 0; i < 1000; i++) {
        const query = queries[i % queries.length];
        converter(query);
      }

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(40000); // Should complete in under 40 seconds (CI environments are slower)
    });

    it('should handle concurrent-like usage patterns', () => {
      const complexQueries = testData.complexQueries;
      const start = Date.now();

      // Simulate concurrent usage with different query types
      for (let i = 0; i < 100; i++) {
        const query = complexQueries[i % complexQueries.length];
        const variables = {
          name: 'String',
          industry: 'String',
          status: 'String',
        };
        converter(query, variables);
      }

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(10000); // Should complete in under 10 seconds
    });
  });
});
