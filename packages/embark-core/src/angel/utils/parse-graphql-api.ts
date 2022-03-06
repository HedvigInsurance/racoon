import { GraphQLAPI, GraphQLType, PassageElement } from '@/shared/types'

import { Attribute } from '../types'
import invariant from 'tiny-invariant'
import { parseGraphQLConstantVariable } from './parse-graphql-constant-variable'
import { parseGraphQLResult } from './parse-graphql-result'
import { parseGraphQLVariable } from './parse-graphql-variable'
import { parseLink } from './parse-link'

const GRAPHQL_TYPE_MAP: Record<GraphQLType, GraphQLType> = {
  [PassageElement.GraphQLQuery]: PassageElement.GraphQLQuery,
  [PassageElement.GraphQLMutation]: PassageElement.GraphQLMutation,
}

const parseGraphQLType = (rawType: string) => {
  const type = GRAPHQL_TYPE_MAP[rawType as GraphQLType]
  if (type) return type
  throw new Error(`Invalid GraphQL type: ${rawType}`)
}

export const parseGraphQLAPI = (element: Element): GraphQLAPI => {
  const nextLink = element.getAttribute(Attribute.NextLink)
  invariant(typeof nextLink === 'string')

  const errorElements = element.getElementsByTagName(PassageElement.Error)
  const errorElement = errorElements.item(0)
  const errorLink = errorElement?.getAttribute(Attribute.NextLink)

  const mutationElement = element.getElementsByTagName(PassageElement.GraphQLMutation).item(0)
  const queryElement = element.getElementsByTagName(PassageElement.GraphQLQuery).item(0)
  const requestElement = mutationElement ?? queryElement

  invariant(
    requestElement !== null,
    `${PassageElement.GraphQLAPI} must have a child Query/Mutation`,
  )

  invariant(typeof requestElement.textContent === 'string')
  const document = requestElement.textContent.trim()

  const variableElements = element.getElementsByTagName(PassageElement.GraphQLVariable)
  const regularVariables = Array.from(variableElements).map(parseGraphQLVariable)

  const constantVariableElements = element.getElementsByTagName(
    PassageElement.GraphQLConstantVariable,
  )
  const constantVariables = Array.from(constantVariableElements).map(parseGraphQLConstantVariable)

  const variables = [...regularVariables, ...constantVariables]

  const resultElements = element.getElementsByTagName(PassageElement.GraphQLResult)
  const results = Array.from(resultElements).map(parseGraphQLResult)

  return {
    type: PassageElement.GraphQLAPI,
    link: parseLink(nextLink),
    errorLink: errorLink ? parseLink(errorLink) : undefined,
    variables,
    requestType: parseGraphQLType(requestElement.tagName),
    document,
    results,
  }
}
