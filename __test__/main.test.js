var converter = require ('../build/src/main.js').default;

describe('converter function', () => {
  

  // Assert greeter result
  it('Sample conversion test', () => {
  
    expect(converter('select Id, Name, (select Id from Opportunities) from Account limit 3')).toMatchSnapshot();
  });
});