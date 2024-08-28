import { ApolloLink } from '@apollo/client'
import {
  checkDocument,
  hasDirectives,
  removeDirectivesFromDocument,
} from '@apollo/client/utilities'

const sanitizedQueryCache = new Map()

const createPersistLink = () =>
  new ApolloLink((operation, forward) => {
    if (!hasDirectives(['persist'], operation.query)) {
      return forward(operation)
    }

    const cacheKey = JSON.stringify(operation.query)
    let sanitizedQuery = sanitizedQueryCache.get(cacheKey)
    if (!sanitizedQuery) {
      checkDocument(operation.query)

      sanitizedQuery = removeDirectivesFromDocument(
        [{ name: 'persist' }],
        operation.query,
      )

      sanitizedQueryCache.set(cacheKey, sanitizedQuery)
    }

    operation.query = sanitizedQuery

    return forward(operation)
  })

export { createPersistLink }
