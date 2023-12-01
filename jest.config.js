const config = {
    testEnvironment: 'node',
    preset: 'ts-jest/presets/default-esm',
  
    transform: {
        '^.+\\.m?[tj]s?$': ['ts-jest', { useESM: true }],
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.(m)?js$': '$1',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(m)?js$',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'build/**/*.js',
        'src/**/*.mts',
        '!src/**/*.d.ts',
        '!src/**/*.d.mts',
    ],
};

module.exports = config;