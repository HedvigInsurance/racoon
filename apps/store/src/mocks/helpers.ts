const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
if (GRAPHQL_ENDPOINT === undefined) throw new Error('NEXT_PUBLIC_GRAPHQL_ENDPOINT is not defined')

export const graphqlConstants = () => ({
  GRAPHQL_ENDPOINT,
})
