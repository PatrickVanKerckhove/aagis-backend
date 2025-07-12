/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  preset: 'ts-jest',

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
};

export default config;
