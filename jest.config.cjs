const config = {
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default',

  transform: {
    '^.+\\.m?[tj]s?$': ['ts-jest'],
  },
  moduleNameMapper: {},
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(m)?js$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'dist/**/*.js',
    '!dist/**/*.d.ts',
    '!dist/**/*.js.map',
    '!dist/**/*.test.js',
    '!dist/**/*.spec.js',
  ],
};

module.exports = config;
