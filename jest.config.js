const config = {
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default',

  transform: {
    '^.+\\.m?[tj]s?$': ['ts-jest'],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.(m)?js$': '$1',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(m)?js$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['build/**/*.js', 'src/**/*.ts', '!src/**/*.d.ts'],
};

module.exports = config;
