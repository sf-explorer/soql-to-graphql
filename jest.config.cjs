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
    'dist/**/*.{js,cjs}',
    '!dist/**/*.d.ts',
    '!dist/**/*.js.map',
    '!dist/**/*.test.js',
    '!dist/**/*.spec.js',
  ],
  // Add modulePathIgnorePatterns to avoid Haste module naming collision
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};

module.exports = config;
