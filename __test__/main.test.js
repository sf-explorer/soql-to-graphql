var converter = require('../build/src/main.js').default;

describe('converter function', () => {


  const simpleQuery = "select Id, Name, Owner.Name, (select Id from Opportunities) from Account where Name like '%N' limit 3"
  it('Simple Query: ' + simpleQuery, () => {

    expect(converter(simpleQuery)).toMatchSnapshot();
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
  (Name LIKE ':searchPattern'
  OR City__c LIKE ':searchPattern'
  OR Tags__c LIKE ':searchPattern')
  AND Price__c <= ':safeMaxPrice'
  AND Beds__c >= ':safeMinBedrooms'
  AND Baths__c >= ':safeMinBathrooms'
WITH USER_MODE
ORDER BY Price__c
LIMIT 3
OFFSET 3
`

  it('Advanced conversion test', () => {

    expect(converter(query)).toMatchSnapshot();
  });

});