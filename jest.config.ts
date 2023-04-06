import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  rootDir: '.',
  modulePaths: ['<rootDir>'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  setupFilesAfterEnv: ['./setupTests.ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'esbuild-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@shared/(.*)': '<rootDir>/src/shared/$1',
    '@shared': '<rootDir>/src/shared',
    '@application/(.*)': '<rootDir>/src/application/$1',
    '@application': '<rootDir>/src/application',
    '@domain/(.*)': '<rootDir>/src/domain/$1',
    '@domain': '<rootDir>/src/domain',
    '@infra-adapters/(.*)': '<rootDir>/src/infra-adapters/$1',
    '@infra-adapters': '<rootDir>/src/infra-adapters',
    '@ui-adapters/(.*)': '<rootDir>/src/ui-adapters/$1',
    '@ui-adapters': '<rootDir>/src/ui-adapters',
  },
};

export default config;
