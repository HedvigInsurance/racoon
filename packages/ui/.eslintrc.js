const baseConfig = require('eslint-config-custom')

/** @type {import('eslint').Linter.Config} */
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
