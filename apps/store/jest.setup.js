// Used for @testing-library/react
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
// Polyfills 'fetch' used in react components
import 'whatwg-fetch'

jest.mock('next/router', () => require('next-router-mock'))
