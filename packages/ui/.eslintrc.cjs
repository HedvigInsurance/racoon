/* eslint-disable */
const baseConfig = require('eslint-config-custom')

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  ...baseConfig,
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  overrides: [
    ...baseConfig.overrides,
    {
      files: ['**/*.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },
  ],
}
