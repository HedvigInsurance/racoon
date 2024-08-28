import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: `${process.env.NEXT_PUBLIC_API_URL}/api/graphql`,
  documents: ['src/**/*.graphql', 'src/**/*.{ts,tsx}', '!src/types/**/*'],
  generates: {
    'src/types/generated/graphql-rsc.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'fragment-matcher',
        'typescript-graphql-request',
      ],
      config: {
        rawRequest: true,
        documentMode: 'documentNode',
        scalars: {
          MonetaryAmount: '../scalars#MonetaryAmount',
          Url: 'string',
        },
      },
    },
    'src/types/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
        'fragment-matcher',
      ],
      config: {
        withHOC: false,
        withComponent: false,
        withHooks: true,
        gqlImport: 'graphql-tag',
        apolloReactHooksImportFrom: '@apollo/client',
        apolloReactCommonImportFrom: '@apollo/client',
        scalars: {
          MonetaryAmount: '../scalars#MonetaryAmount',
          Url: 'string',
        },
      },
    },
    'src/types/generated/msw/': {
      preset: 'client',
      plugins: ['typescript-msw'],
      config: {
        scalars: {
          MonetaryAmount: '../../scalars#MonetaryAmount',
          Url: 'string',
        },
      },
    },
    './graphql.schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
}

export default config
