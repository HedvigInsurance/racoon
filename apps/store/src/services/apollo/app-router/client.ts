import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'
import { errorLink } from '../errorLink'
import { httpLink } from '../httpLink'
import { userErrorLink } from '../userErrorLink'
import { headersLink } from './headersLink'

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    name: 'Web:Racoon:Store',

    link: ApolloLink.from([
      // Has to be the first to process output last
      // We re-raise userError results as errors, we don't want errorLink to see those
      userErrorLink,
      errorLink,
      headersLink,
      httpLink,
    ]),

    cache: new InMemoryCache(),
  })
})
