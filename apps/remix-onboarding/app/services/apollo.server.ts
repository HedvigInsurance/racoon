import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

export const apolloClient = new ApolloClient({
  ssrMode: true,
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: process.env.GRAPHQL_ENDPOINT,
    credentials: 'same-origin',
  }),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
  },
})
