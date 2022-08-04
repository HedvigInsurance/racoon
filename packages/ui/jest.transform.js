/* eslint-env node */
// OK to use require in node context
// eslint-disable-next-line
const babel = require('babel-jest')

module.exports = babel.default.createTransformer({
  presets: ['next/babel'],
  // this is to be able to use [MyComponent] as a CSS selector
  plugins: ['@emotion'],
})
