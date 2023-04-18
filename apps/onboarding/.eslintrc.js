/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['custom', 'plugin:cypress/recommended'],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      parserOptions: {
        project: ['./tsconfig.json', '../../packages/*/tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      rules: {
        // Disabled to ignore old violations
        // We may want to enable these rules if we ever plan to actively work on this package
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-unnecessary-condition': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
      },
    },
  ],
}
