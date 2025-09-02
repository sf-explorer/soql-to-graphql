const { getWhereField, getWhereCond } = require('../dist/index.cjs');

describe('WhereConverter Module', () => {
  describe('getWhereField', () => {
    it('should convert simple field condition', () => {
      const condition = {
        field: 'Name',
        operator: '=',
        value: 'Test',
        literalType: 'STRING',
      };

      const result = getWhereField(condition);
      expect(result).toEqual({
        Name: { eq: 'Test' },
      });
    });

    it('should convert boolean field condition', () => {
      const condition = {
        field: 'IsActive',
        operator: '=',
        value: 'TRUE',
        literalType: 'BOOLEAN',
      };

      const result = getWhereField(condition);
      expect(result).toEqual({
        IsActive: { eq: true },
      });
    });

    it('should convert integer field condition', () => {
      const condition = {
        field: 'Age',
        operator: '>',
        value: '25',
        literalType: 'INTEGER',
      };

      const result = getWhereField(condition);
      expect(result).toEqual({
        Age: { gt: 25 },
      });
    });

    it('should convert array field condition', () => {
      const condition = {
        field: 'Status',
        operator: 'in',
        value: ['Active', 'Pending'],
        literalType: 'STRING',
      };

      const result = getWhereField(condition);
      expect(result).toEqual({
        Status: { in: ['Active', 'Pending'] },
      });
    });

    it('should handle nested field paths', () => {
      const condition = {
        field: 'Owner.Name',
        operator: '=',
        value: 'John Doe',
        literalType: 'STRING',
      };

      const result = getWhereField(condition);
      expect(result).toEqual({
        Owner: {
          Name: { eq: 'John Doe' },
        },
      });
    });

    it('should handle bind variables', () => {
      const condition = {
        field: 'Id',
        operator: '=',
        value: ':recordId',
        literalType: 'APEX_BIND_VARIABLE',
      };

      const input = { recordId: 'String' };
      const result = getWhereField(condition, input);

      expect(result.Id.eq).toBeDefined();
      expect(result.Id.eq.constructor.name).toBe('VariableType');
    });

    it('should throw error for invalid condition', () => {
      expect(() => getWhereField(null)).toThrow(
        'Invalid condition: field is required'
      );
      expect(() => getWhereField({})).toThrow(
        'Invalid condition: field is required'
      );
    });
  });

  describe('getWhereCond', () => {
    it('should handle simple field condition', () => {
      const condition = {
        field: 'Name',
        operator: '=',
        value: 'Test',
        literalType: 'STRING',
      };

      const result = getWhereCond(condition);
      expect(result).toEqual({
        Name: { eq: 'Test' },
      });
    });

    it('should handle AND logical operator', () => {
      const condition = {
        operator: 'AND',
        left: {
          field: 'Name',
          operator: '=',
          value: 'Test',
          literalType: 'STRING',
        },
        right: {
          field: 'Age',
          operator: '>',
          value: '25',
          literalType: 'INTEGER',
        },
      };

      const result = getWhereCond(condition);
      expect(result).toEqual({
        and: [{ Name: { eq: 'Test' } }, { Age: { gt: 25 } }],
      });
    });

    it('should handle OR logical operator', () => {
      const condition = {
        operator: 'OR',
        left: {
          field: 'Status',
          operator: '=',
          value: 'Active',
          literalType: 'STRING',
        },
        right: {
          field: 'Status',
          operator: '=',
          value: 'Pending',
          literalType: 'STRING',
        },
      };

      const result = getWhereCond(condition);
      expect(result).toEqual({
        or: [{ Status: { eq: 'Active' } }, { Status: { eq: 'Pending' } }],
      });
    });

    it('should throw error for invalid condition', () => {
      expect(() => getWhereCond(null)).toThrow(
        'Invalid condition: condition is required'
      );
    });
  });
});
