const { getArgs, getQuery } = require('../dist/index.cjs');

describe('QueryConverter Module', () => {
  describe('getArgs', () => {
    it('should convert query with limit', () => {
      const parsedQuery = { limit: 10 };
      const result = getArgs(parsedQuery);
      expect(result).toEqual({ first: 10 });
    });

    it('should convert query with where clause', () => {
      const parsedQuery = {
        where: {
          field: 'Name',
          operator: '=',
          value: 'Test',
          literalType: 'STRING',
        },
      };

      const result = getArgs(parsedQuery);
      expect(result.where).toBeDefined();
      expect(result.where.Name).toBeDefined();
    });

    it('should convert query with orderBy (single field)', () => {
      const parsedQuery = {
        orderBy: {
          field: 'Name',
          order: 'ASC',
        },
      };

      const result = getArgs(parsedQuery);
      expect(result).toEqual({
        orderBy: {
          Name: { order: 'ASC' },
        },
      });
    });

    it('should convert query with orderBy (array)', () => {
      const parsedQuery = {
        orderBy: [
          {
            field: 'Name',
            order: 'DESC',
          },
        ],
      };

      const result = getArgs(parsedQuery);
      expect(result).toEqual({
        orderBy: {
          Name: { order: 'DESC' },
        },
      });
    });

    it('should use default order when not specified', () => {
      const parsedQuery = {
        orderBy: {
          field: 'Name',
        },
      };

      const result = getArgs(parsedQuery);
      expect(result).toEqual({
        orderBy: {
          Name: { order: 'ASC' },
        },
      });
    });

    it('should handle orderBy with function name', () => {
      const parsedQuery = {
        orderBy: {
          functionName: 'COUNT',
          order: 'DESC',
        },
      };

      const result = getArgs(parsedQuery);
      expect(result).toEqual({
        orderBy: {
          COUNT: { order: 'DESC' },
        },
      });
    });

    it('should handle orderBy with orderByField', () => {
      const parsedQuery = {
        orderBy: {
          orderByField: 'CreatedDate',
          order: 'ASC',
        },
      };

      const result = getArgs(parsedQuery);
      expect(result).toEqual({
        orderBy: {
          CreatedDate: { order: 'ASC' },
        },
      });
    });

    it('should handle unknown orderBy field type', () => {
      const parsedQuery = {
        orderBy: {
          unknown: 'value',
          order: 'ASC',
        },
      };

      const result = getArgs(parsedQuery);
      expect(result).toEqual({
        orderBy: {
          unknown: { order: 'ASC' },
        },
      });
    });

    it('should combine multiple args', () => {
      const parsedQuery = {
        limit: 5,
        where: {
          field: 'Status',
          operator: '=',
          value: 'Active',
          literalType: 'STRING',
        },
        orderBy: {
          field: 'Name',
          order: 'ASC',
        },
      };

      const result = getArgs(parsedQuery);
      expect(result.first).toBe(5);
      expect(result.where).toBeDefined();
      expect(result.orderBy).toBeDefined();
    });
  });

  describe('getQuery', () => {
    it('should create query without pageInfo when no limit', () => {
      const parsedQuery = {
        fields: [{ field: 'Id' }],
      };

      const result = getQuery(parsedQuery);
      expect(result).toEqual({
        __args: {},
        edges: {
          node: { Id: true },
        },
      });
    });

    it('should create query with pageInfo when limit is present', () => {
      const parsedQuery = {
        limit: 10,
        fields: [{ field: 'Id' }],
      };

      const result = getQuery(parsedQuery);
      expect(result).toEqual({
        __args: { first: 10 },
        edges: {
          node: { Id: true },
        },
        pageInfo: {
          endCursor: true,
          hasNextPage: true,
          hasPreviousPage: true,
        },
      });
    });

    it('should pass input variables to getArgs', () => {
      const parsedQuery = {
        fields: [{ field: 'Id' }],
        where: {
          field: 'Name',
          operator: '=',
          value: ':name',
          literalType: 'APEX_BIND_VARIABLE',
        },
      };

      const input = { name: 'String' };
      const result = getQuery(parsedQuery, input);
      expect(result.__args.where).toBeDefined();
    });
  });
});
