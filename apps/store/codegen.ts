import { type CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  documents: 'src/**/*.graphql',
  generates: {
    './src/services/apollo/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        scalars: { UUID: 'string' },
      },
    },
  },
}

export default config
