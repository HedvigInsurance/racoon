import { jest } from '@jest/globals'
// Used for @testing-library/react
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
// Polyfills 'fetch' used in react components
import 'whatwg-fetch'

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('next/router', () => require('next-router-mock'))
