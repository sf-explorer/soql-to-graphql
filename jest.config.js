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
  collectCoverageFrom: [
    'build/**/*.js',
    '!build/**/*.d.ts',
    '!build/**/*.js.map',
    '!build/**/*.test.js',
    '!build/**/*.spec.js',
  ],
};

module.exports = config;
