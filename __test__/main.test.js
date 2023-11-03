var converter = require ('../build/src/main.js').default;

describe('greeter function', () => {
  

  // Assert greeter result
  it('Sample test', () => {
  
    expect(converter('select Id from Account')).toBe(`query Accounts {
        uiapi {
          query {
             Account  {
        edges {
          node {
Id
          }
        }
      }
          }
        }
      }`);
  });
});