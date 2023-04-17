/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['custom', 'plugin:cypress/recommended'],
  parserOptions: {
    project: ['./tsconfig.json', '../../packages/*/tsconfig.json'],
  },
}
