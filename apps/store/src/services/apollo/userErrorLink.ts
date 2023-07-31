import { ApolloError, ApolloLink } from '@apollo/client'

export const userErrorLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((fetchResult) => {
    for (const result of Object.values(fetchResult.data ?? {})) {
      const { userError } = result ?? {}
      if (userError) {
        throw new ApolloError({
          errorMessage: userError.message,
          extraInfo: { userError },
        })
      }
    }
    return fetchResult
  })
})
