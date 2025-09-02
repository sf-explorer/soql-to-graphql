const { getWhereOperator } = require('../dist/index.js');

describe('Operators Module', () => {
  describe('getWhereOperator', () => {
    it('should convert equality operator', () => {
      const condition = { operator: '=' };
      expect(getWhereOperator(condition)).toBe('eq');
    });

    it('should convert inequality operator', () => {
      const condition = { operator: '!=' };
      expect(getWhereOperator(condition)).toBe('ne');
    });

    it('should convert like operator', () => {
      const condition = { operator: 'like' };
      expect(getWhereOperator(condition)).toBe('like');
    });

    it('should convert in operator', () => {
      const condition = { operator: 'in' };
      expect(getWhereOperator(condition)).toBe('in');
    });

    it('should convert greater than operator', () => {
      const condition = { operator: '>' };
      expect(getWhereOperator(condition)).toBe('gt');
    });

    it('should convert greater than or equal operator', () => {
      const condition = { operator: '>=' };
      expect(getWhereOperator(condition)).toBe('gte');
    });

    it('should convert less than operator', () => {
      const condition = { operator: '<' };
      expect(getWhereOperator(condition)).toBe('lt');
    });

    it('should convert less than or equal operator', () => {
      const condition = { operator: '<=' };
      expect(getWhereOperator(condition)).toBe('lte');
    });

    it('should handle case insensitive operators', () => {
      const condition = { operator: 'LIKE' };
      expect(getWhereOperator(condition)).toBe('like');
    });

    it('should return default operator for unknown operators', () => {
      const condition = { operator: 'unknown' };
      expect(getWhereOperator(condition)).toBe('eq');
    });

    it('should return default operator for empty operator', () => {
      const condition = { operator: '' };
      expect(getWhereOperator(condition)).toBe('eq');
    });
  });
});
