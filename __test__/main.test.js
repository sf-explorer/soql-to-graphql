const converter = require('../dist/index.cjs').soql2graphql;
const { validateGraphQLStructure } = require('./testUtils');

describe('Main Converter Integration Tests', () => {
  describe('Basic SOQL Conversions', () => {
    const simpleQuery =
      "select Id, Name, Owner.Name, (select Id from Opportunities) from Account where Name like '%N' limit 3";

    it('should convert simple query with relationships and subqueries', () => {
      const result = converter(simpleQuery);

      // Validate structure
      validateGraphQLStructure(result, {
        sObject: 'Account',
        fields: ['Id', 'Name', 'Owner', 'Opportunities'],
        hasWhere: true,
        hasLimit: true,
      });

      // Snapshot test for regression testing
      expect(result).toMatchSnapshot();
    });

    const queryWithVar =
      'select Id, Name from Account where (Id = :recordId and Name like :name) or BillingCountry like :country limit 3';

    it('should convert query with variables and complex WHERE clause', () => {
      const variables = {
        recordId: 'ID!',
        name: 'String = "%"',
        country: 'String',
      };
      const result = converter(queryWithVar, variables);

      // Validate structure
      validateGraphQLStructure(result, {
        sObject: 'Account',
        fields: ['Id', 'Name'],
        hasWhere: true,
        hasLimit: true,
        hasVariables: true,
      });

      // Snapshot test
      expect(result).toMatchSnapshot();
    });

    const advancedQuery = `SELECT
      Id,
      Name,
      Address__c,
      City__c,
      State__c,
      Description__c,
      Price__c,
      Baths__c,
      Beds__c,
      Thumbnail__c,
      Location__Latitude__s,
      Location__Longitude__s
    FROM Property__c
    WHERE
      (Name LIKE :searchPattern
      OR City__c LIKE :searchPattern
      OR Tags__c LIKE :searchPattern)
      AND Price__c <= :safeMaxPrice
      AND Beds__c > :safeMinBedrooms
      AND Baths__c >= :safeMinBathrooms
    WITH USER_MODE
    ORDER BY Price__c desc
    LIMIT 3
    OFFSET 3`;

    it('should convert advanced real estate query with multiple conditions', () => {
      const variables = {
        searchPattern: 'String ="%"',
        safeMaxPrice: 'Currency = 10000',
        safeMinBedrooms: 'Double = 3',
        cursorSize: 'Double = 3',
        safeMinBathrooms: 'Double = 2',
      };

      const result = converter(advancedQuery, variables);

      // Validate structure
      validateGraphQLStructure(result, {
        sObject: 'Property__c',
        fields: [
          'Id',
          'Name',
          'Address__c',
          'City__c',
          'State__c',
          'Description__c',
          'Price__c',
          'Baths__c',
          'Beds__c',
          'Thumbnail__c',
          'Location__Latitude__s',
          'Location__Longitude__s',
        ],
        hasWhere: true,
        hasLimit: true,
        hasOrderBy: true,
        hasVariables: true,
      });

      // Snapshot test
      expect(result).toMatchSnapshot();
    });
  });

  describe('Special Query Types', () => {
    const inQuery =
      "select Id, Name, Owner.Name from Account where Id in ('0030700000ywKMfAAM') limit 3";

    it('should convert IN clause queries', () => {
      const result = converter(inQuery);

      validateGraphQLStructure(result, {
        sObject: 'Account',
        fields: ['Id', 'Name', 'Owner'],
        hasWhere: true,
        hasLimit: true,
      });

      expect(result).toMatchSnapshot();
    });

    const subWhereQuery =
      'select Id FROM OrderItem WHERE Order.AccountId = :accountId limit 3';

    it('should convert subquery WHERE conditions', () => {
      const result = converter(subWhereQuery);

      validateGraphQLStructure(result, {
        sObject: 'OrderItem',
        fields: ['Id'],
        hasWhere: true,
        hasLimit: true,
      });

      expect(result).toMatchSnapshot();
    });

    const booleanQuery = 'Select IsClosed from Case where IsClosed=true';

    it('should convert boolean WHERE conditions', () => {
      const result = converter(booleanQuery);

      validateGraphQLStructure(result, {
        sObject: 'Case',
        fields: ['IsClosed'],
        hasWhere: true,
      });

      expect(result).toMatchSnapshot();
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    it('should handle minimal valid query', () => {
      const result = converter('SELECT Id FROM Account');

      validateGraphQLStructure(result, {
        sObject: 'Account',
        fields: ['Id'],
      });
    });

    it('should handle query with only SELECT and FROM', () => {
      const result = converter('SELECT Id, Name FROM Contact');

      validateGraphQLStructure(result, {
        sObject: 'Contact',
        fields: ['Id', 'Name'],
      });
    });

    it('should handle query with custom fields', () => {
      const result = converter('SELECT Id, Custom_Field__c FROM Account');

      validateGraphQLStructure(result, {
        sObject: 'Account',
        fields: ['Id', 'Custom_Field__c'],
      });
    });
  });
});
