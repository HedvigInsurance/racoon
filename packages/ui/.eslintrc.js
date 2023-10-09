/** @type {import('eslint').Linter.Config} */
const baseConfig = require('eslint-config-custom')

module.exports = {
    root: true,
    ...baseConfig,
    overrides: [
        ...baseConfig.overrides,
        {
            files: ['**/*.{ts,tsx}'],
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: __dirname,
            },
        },
    ],
}
