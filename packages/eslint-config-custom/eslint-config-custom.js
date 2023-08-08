/** @type {import('eslint').Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'next/core-web-vitals',
    // Uses eslint-config-prettier to turn off all rules that are unnecessary or might conflict with Prettier
    'prettier',
  ],

  plugins: ['import', 'testing-library', 'jest', '@typescript-eslint'],

  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },

  rules: {
    'no-unneeded-ternary': 'error',
    'no-nested-ternary': 'error',
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'never',
        groups: ['builtin', 'external', 'internal', 'unknown', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: 'ui',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['internal'],
      },
    ],
    '@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }],
    '@typescript-eslint/no-unused-vars': 'error', // Also covers unused import
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'error', // Also unneeded optional chaining
    '@typescript-eslint/restrict-template-expressions': 'off', // Breaks with emotion styles referring to other components
    '@typescript-eslint/consistent-indexed-object-style': 'off',

    // TODO: Typed lint rules that we might want to consider in the future
    '@typescript-eslint/no-unsafe-enum-comparison': 'off',
    '@typescript-eslint/prefer-optional-chain': 'off',
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/non-nullable-type-assertion-style': 'off',
    '@typescript-eslint/no-redundant-type-constituents': 'off',

    '@next/next/no-html-link-for-pages': 'off',
    'import/no-anonymous-default-export': 'off', // For Storybook stories
  },
  overrides: [
    // Only uses Testing Library lint rules in test files
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react', 'plugin:jest/recommended'],
      rules: {
        'testing-library/no-node-access': 'off',
        'testing-library/no-container': 'off',
      },
    },
    // Allow requires in node js modules (assuming we don't have JS on frontend side)
    {
      files: ['**/*.js'],
      env: {
        node: true,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
}
