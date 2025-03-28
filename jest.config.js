module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.test.ts','**/src/**/*.test.tsx'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};