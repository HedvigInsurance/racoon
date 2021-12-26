// Used for @testing-library/react
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'
// Polyfills 'fetch' used in react components
import 'whatwg-fetch'
import { TextEncoder, TextDecoder } from 'util'

import { server } from './src/mocks/server'

// Polyfills TextEncoder/TextDecoder
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock next-i18next
jest.mock('next-i18next', () => {
  return {
    useTranslation: () => {
      return {
        t: (str) => str,
        i18n: {
          language: 'en',
          changeLanguage: jest.fn().mockImplementation((lang) => console.log(lang)),
        },
      }
    },
    withTranslation: () => (Component) => {
      Component.defaultProps = { ...Component.defaultProps, t }
      return Component
    },
  }
})

// Establish API mocking before all tests.
beforeAll(() => server.listen())
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())
