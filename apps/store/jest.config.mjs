import nextJest from 'next/jest.js'
import { pathsToModuleNameMapper } from 'ts-jest'
import data from './tsconfig.json' assert { type: 'json' }

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  testMatch: ['**/?(*.)test.[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: pathsToModuleNameMapper(data.compilerOptions.paths, {
    prefix: `<rootDir>/${data.compilerOptions.baseUrl}/`,
  }),
  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig)
