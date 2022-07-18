module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['next/core-web-vitals', 'prettier', 'plugin:@typescript-eslint/recommended'],
  plugins: ['import', 'testing-library', 'jest', '@typescript-eslint'],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
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
  ],
}
