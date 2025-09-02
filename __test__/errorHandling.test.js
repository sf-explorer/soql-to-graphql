const converter = require('../build/src/main.js').default;

describe('Error Handling', () => {
  describe('Input Validation', () => {
    it('should throw error for null query', () => {
      expect(() => converter(null)).toThrow('SOQL query string is required');
    });

    it('should throw error for undefined query', () => {
      expect(() => converter(undefined)).toThrow(
        'SOQL query string is required'
      );
    });

    it('should throw error for empty string query', () => {
      expect(() => converter('')).toThrow('SOQL query string is required');
    });

    it('should throw error for non-string query', () => {
      expect(() => converter(123)).toThrow('SOQL query string is required');
      expect(() => converter({})).toThrow('SOQL query string is required');
      expect(() => converter([])).toThrow('SOQL query string is required');
    });
  });

  describe('Invalid SOQL Queries', () => {
    it('should handle malformed SELECT statements', () => {
      expect(() => converter('SELECT from Account')).toThrow();
    });

    it('should handle missing FROM clause', () => {
      expect(() => converter('SELECT Id, Name')).toThrow();
    });

    it('should handle invalid WHERE syntax', () => {
      expect(() => converter('SELECT Id FROM Account WHERE')).toThrow();
    });

    it('should handle invalid ORDER BY syntax', () => {
      expect(() => converter('SELECT Id FROM Account ORDER BY')).toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle query with only SELECT and FROM', () => {
      const result = converter('SELECT Id FROM Account');
      expect(result).toBeDefined();
      expect(result).toContain('query');
    });

    it('should handle query with special characters in field names', () => {
      const result = converter('SELECT Custom_Field__c FROM Account');
      expect(result).toBeDefined();
    });

    it('should handle query with numeric field names', () => {
      const result = converter('SELECT Field1, Field2 FROM Account');
      expect(result).toBeDefined();
    });

    it('should handle very long field names', () => {
      const longFieldName =
        'Very_Long_Custom_Field_Name_That_Exceeds_Normal_Length__c';
      const result = converter(`SELECT ${longFieldName} FROM Account`);
      expect(result).toBeDefined();
    });
  });

  describe('Variable Binding Edge Cases', () => {
    it('should handle undefined variables', () => {
      const query = 'SELECT Id FROM Account WHERE Name = :undefinedVar';
      const result = converter(query, {});
      expect(result).toBeDefined();
    });

    it('should handle null variables', () => {
      const query = 'SELECT Id FROM Account WHERE Name = :nullVar';
      const result = converter(query, { nullVar: null });
      expect(result).toBeDefined();
    });

    it('should handle empty string variables', () => {
      const query = 'SELECT Id FROM Account WHERE Name = :emptyVar';
      const result = converter(query, { emptyVar: '' });
      expect(result).toBeDefined();
    });
  });

  describe('Complex Query Edge Cases', () => {
    it('should handle deeply nested WHERE conditions', () => {
      const query =
        "SELECT Id FROM Account WHERE (Name = 'Test' AND (Age > 25 OR Status = 'Active'))";
      const result = converter(query);
      expect(result).toBeDefined();
    });

    it('should handle multiple ORDER BY clauses', () => {
      const query =
        'SELECT Id, Name FROM Account ORDER BY Name ASC, CreatedDate DESC';
      const result = converter(query);
      expect(result).toBeDefined();
    });

    it('should handle subqueries with complex WHERE clauses', () => {
      const query =
        'SELECT Id, (SELECT Id FROM Opportunities WHERE Amount > 1000) FROM Account';
      const result = converter(query);
      expect(result).toBeDefined();
    });
  });
});
