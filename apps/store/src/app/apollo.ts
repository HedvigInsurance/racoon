import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
})

const headersLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'hedvig-language': 'sv-SE',
    },
  }
})

export const apolloClient = new ApolloClient({
  name: 'Web:Racoon:Store',
  ssrMode: true,
  cache: new InMemoryCache(),
  link: from([headersLink, httpLink]),
})
