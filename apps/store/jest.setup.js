// Used for @testing-library/react
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
// Polyfills 'fetch' used in react components
import 'whatwg-fetch'

import { server } from './src/mocks/server'

jest.mock('next/router', () => require('next-router-mock'))

// Establish API mocking before all tests.
beforeAll(() => server.listen())
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())
