const converter = require('../build/src/main.js').default;

describe('Integration Tests', () => {
  describe('Basic SOQL to GraphQL Conversion', () => {
    it('should convert simple SELECT query', () => {
      const soql = 'SELECT Id, Name FROM Account';
      const result = converter(soql);
      
      expect(result).toContain('query');
      expect(result).toContain('uiapi');
      expect(result).toContain('Account');
      expect(result).toContain('Id');
      expect(result).toContain('Name');
    });

    it('should convert query with WHERE clause', () => {
      const soql = "SELECT Id FROM Account WHERE Name = 'Test'";
      const result = converter(soql);
      
      expect(result).toContain('where');
      expect(result).toContain('eq');
    });

    it('should convert query with LIMIT', () => {
      const soql = 'SELECT Id FROM Account LIMIT 10';
      const result = converter(soql);
      
      expect(result).toContain('first');
      expect(result).toContain('pageInfo');
    });

    it('should convert query with ORDER BY', () => {
      const soql = 'SELECT Id FROM Account ORDER BY Name ASC';
      const result = converter(soql);
      
      expect(result).toContain('orderBy');
    });
  });

  describe('Complex Query Features', () => {
    it('should handle relationship fields', () => {
      const soql = 'SELECT Id, Owner.Name FROM Account';
      const result = converter(soql);
      
      expect(result).toContain('Owner');
    });

    it('should handle subqueries', () => {
      const soql = 'SELECT Id, (SELECT Id FROM Opportunities) FROM Account';
      const result = converter(soql);
      
      expect(result).toContain('Opportunities');
    });

    it('should handle function calls', () => {
      const soql = 'SELECT COUNT(Id) FROM Account';
      const result = converter(soql);
      
      expect(result).toContain('label');
    });

    it('should handle toLabel function', () => {
      const soql = 'SELECT toLabel(Status) FROM Case';
      const result = converter(soql);
      
      expect(result).toContain('label');
    });
  });

  describe('Variable Binding', () => {
    it('should handle single variable', () => {
      const soql = 'SELECT Id FROM Account WHERE Name = :name';
      const variables = { name: 'String' };
      const result = converter(soql, variables);
      
      expect(result).toMatch(/\$[a-zA-Z_][a-zA-Z0-9_]*:/);
    });

    it('should handle multiple variables', () => {
      const soql = 'SELECT Id FROM Account WHERE Name = :name AND Age > :age';
      const variables = { name: 'String', age: 'Integer' };
      const result = converter(soql, variables);
      
      expect(result).toMatch(/\$[a-zA-Z_][a-zA-Z0-9_]*:/);
    });

    it('should handle variables in subqueries', () => {
      const soql = 'SELECT Id, (SELECT Id FROM Opportunities WHERE Amount > :minAmount) FROM Account';
      const variables = { minAmount: 'Currency' };
      const result = converter(soql, variables);
      
      expect(result).toMatch(/\$[a-zA-Z_][a-zA-Z0-9_]*:/);
    });
  });

  describe('Data Type Handling', () => {
    it('should handle boolean values', () => {
      const soql = 'SELECT IsActive FROM Account WHERE IsActive = true';
      const result = converter(soql);
      
      expect(result).toContain('eq');
    });

    it('should handle integer values', () => {
      const soql = 'SELECT Age FROM Account WHERE Age > 25';
      const result = converter(soql);
      
      expect(result).toContain('gt');
    });

    it('should handle string values with quotes', () => {
      const soql = "SELECT Name FROM Account WHERE Name = 'Test Company'";
      const result = converter(soql);
      
      expect(result).toContain('eq');
    });

    it('should handle IN clause with multiple values', () => {
      const soql = "SELECT Id FROM Account WHERE Status IN ('Active', 'Pending')";
      const result = converter(soql);
      
      expect(result).toContain('in');
    });
  });

  describe('Logical Operators', () => {
    it('should handle AND operator', () => {
      const soql = "SELECT Id FROM Account WHERE Name = 'Test' AND Age > 25";
      const result = converter(soql);
      
      expect(result).toContain('and');
    });

    it('should handle OR operator', () => {
      const soql = "SELECT Id FROM Account WHERE Name = 'Test' OR Name = 'Demo'";
      const result = converter(soql);
      
      expect(result).toContain('or');
    });

    it('should handle complex logical combinations', () => {
      const soql = "SELECT Id FROM Account WHERE (Name = 'Test' OR Name = 'Demo') AND Age > 25";
      const result = converter(soql);
      
      expect(result).toContain('and');
      expect(result).toContain('or');
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle typical CRM query', () => {
      const soql = `
        SELECT Id, Name, Email, Phone, Owner.Name, Owner.Email
        FROM Contact
        WHERE AccountId = :accountId
        AND IsActive = true
        ORDER BY Name ASC
        LIMIT 100
      `;
      const variables = { accountId: 'ID!' };
      const result = converter(soql, variables);
      
      expect(result).toContain('Contact');
      expect(result).toContain('Owner');
      expect(result).toMatch(/\$[a-zA-Z_][a-zA-Z0-9_]*:/);
    });

    it('should handle reporting query', () => {
      const soql = `
        SELECT COUNT(Id), SUM(Amount), AVG(Amount)
        FROM Opportunity
        WHERE StageName = 'Closed Won'
        AND CloseDate >= :startDate
        AND CloseDate <= :endDate
      `;
      const variables = { 
        startDate: 'Date', 
        endDate: 'Date' 
      };
      const result = converter(soql, variables);
      
      expect(result).toContain('Opportunity');
      expect(result).toMatch(/\$[a-zA-Z_][a-zA-Z0-9_]*:/);
    });

    it('should handle complex relationship query', () => {
      const soql = `
        SELECT Id, Name, 
               (SELECT Id, Name, Amount FROM Opportunities WHERE StageName = 'Closed Won'),
               (SELECT Id, Subject FROM Cases WHERE Status = 'Open')
        FROM Account
        WHERE Industry = :industry
        LIMIT 50
      `;
      const variables = { industry: 'String' };
      const result = converter(soql, variables);
      
      expect(result).toContain('Opportunities');
      expect(result).toContain('Cases');
      expect(result).toMatch(/\$[a-zA-Z_][a-zA-Z0-9_]*:/);
    });
  });
});
