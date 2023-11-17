var converter = require('../build/src/main.js').default;

describe('converter function', () => {


  const simpleQuery = "select Id, Name, Owner.Name, (select Id from Opportunities) from Account where Name like '%N' limit 3"
  it('Simple Query: ' + simpleQuery, () => {

    expect(converter(simpleQuery)).toMatchSnapshot();
  });

  const queryWithVar = "select Id, Name from Account where (Id = :recordId and Name like :name) or BillingCountry like :country limit 3"

  it('Query with var ' + queryWithVar, () => {

    expect(converter(queryWithVar, { recordId: 'ID!', name: 'String = "%"', country: 'String' })).toMatchSnapshot();
  });



  const query = `SELECT
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
  AND Beds__c >= :safeMinBedrooms
  AND Baths__c >= :safeMinBathrooms
WITH USER_MODE
ORDER BY Price__c desc
LIMIT 3
OFFSET 3
`

  it('Advanced conversion test', () => {

    expect(converter(query, {
      searchPattern: 'String ="%"',
      safeMaxPrice: 'Currency = 10000',
      safeMinBedrooms: 'Double = 3',
      cursorSize: 'Double = 3',
      safeMinBathrooms: 'Double = 2',
    })).toMatchSnapshot();
  });

});