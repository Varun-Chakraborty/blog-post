/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/types/*.ts',
  ],
  coverageDirectory: 'coverage',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/docker-dev/', // Exclude docker-dev from tests
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/docker-dev/', // Also exclude docker-dev from watch mode
  ],
};
