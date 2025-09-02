const { getField, getQueryNode } = require('../dist/index.js');

describe('FieldConverter Module', () => {
  describe('getField', () => {
    it('should convert simple field', () => {
      const field = { field: 'Name' };
      const result = getField(field);
      expect(result).toEqual({ value: true });
    });

    it('should convert Id field to boolean true', () => {
      const field = { field: 'Id' };
      const result = getField(field);
      expect(result).toBe(true);
    });

    it('should handle field relationship', () => {
      const field = {
        type: 'FieldRelationship',
        field: 'Owner',
        relationships: ['Name'],
      };
      const result = getField(field);
      expect(result).toEqual({
        Owner: { value: true },
      });
    });

    it('should handle toLabel function', () => {
      const field = {
        functionName: 'toLabel',
        parameters: ['Status'],
      };
      const result = getField(field);
      expect(result).toEqual({ label: true });
    });

    it('should handle other functions', () => {
      const field = {
        functionName: 'COUNT',
        parameters: ['Id'],
      };
      const result = getField(field);
      expect(result).toEqual({ label: true });
    });

    it('should handle field subquery', () => {
      const field = {
        type: 'FieldSubquery',
        subquery: {
          relationshipName: 'Opportunities',
          fields: [{ field: 'Id' }],
        },
      };

      const result = getField(field);
      expect(result).toEqual({
        __args: {},
        edges: {
          node: {
            Id: true,
          },
        },
      });
    });

    it('should return empty string for unknown field type', () => {
      const field = { unknown: 'value' };
      const result = getField(field);
      expect(result).toBe('');
    });

    it('should throw error for invalid field', () => {
      expect(() => getField(null)).toThrow('Invalid field: field is required');
      expect(() => getField(undefined)).toThrow(
        'Invalid field: field is required'
      );
    });
  });

  describe('getQueryNode', () => {
    it('should convert fields to query node', () => {
      const parsedQuery = {
        fields: [
          { field: 'Id' },
          { field: 'Name' },
          { relationships: ['Owner'], field: 'Name' },
        ],
      };

      const result = getQueryNode(parsedQuery);
      expect(result).toEqual({
        Id: true,
        Name: { value: true },
        Owner: { value: true },
      });
    });

    it('should handle fields with relationships', () => {
      const parsedQuery = {
        fields: [
          { relationships: ['Owner'], field: 'Name' },
          { relationships: ['Account'], field: 'Name' },
        ],
      };

      const result = getQueryNode(parsedQuery);
      expect(result).toEqual({
        Owner: { value: true },
        Account: { value: true },
      });
    });

    it('should handle fields with subqueries', () => {
      const parsedQuery = {
        fields: [
          {
            subquery: { relationshipName: 'Opportunities' },
            field: 'Id',
          },
        ],
      };

      const result = getQueryNode(parsedQuery);
      expect(result).toEqual({
        Id: true,
      });
    });

    it('should handle fields with parameters', () => {
      const parsedQuery = {
        fields: [
          {
            functionName: 'toLabel',
            parameters: ['Status'],
          },
        ],
      };

      const result = getQueryNode(parsedQuery);
      expect(result).toEqual({
        Status: { label: true },
      });
    });

    it('should return empty object for no fields', () => {
      const parsedQuery = { fields: null };
      const result = getQueryNode(parsedQuery);
      expect(result).toEqual({});
    });

    it('should return empty object for empty fields array', () => {
      const parsedQuery = { fields: [] };
      const result = getQueryNode(parsedQuery);
      expect(result).toEqual({});
    });
  });
});
