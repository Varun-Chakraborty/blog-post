/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json', // Specify your test-specific tsconfig file here
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Adjust this according to your alias setup
  },
  // Enable coverage collection
  collectCoverage: true,
  // Define which files to collect coverage from
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // Adjust according to the files you want to include in coverage
    '!src/**/*.d.ts',    // Exclude type definition files
  ],
  // Define the output directory for coverage reports
  coverageDirectory: 'coverage',
  // Set global coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
