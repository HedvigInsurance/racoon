import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: process.env.GRAPHQL_ENDPOINT,
  }),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
  },
})
