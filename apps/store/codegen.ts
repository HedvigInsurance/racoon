import { type CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  generates: {
    'src/services/graphql/generated.ts': {
      documents: 'src/**/*.graphql',
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: { scalars: { UUID: 'string' } },
    },
  },
}

export default config
