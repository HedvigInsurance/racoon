import { type ErrorResponse, onError } from '@apollo/client/link/error'

export const errorLink = onError((error: ErrorResponse) => {
  if (error.graphQLErrors)
    error.graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
    )
  if (error.networkError) console.log(`[Network error]: ${error.networkError}`)
})
