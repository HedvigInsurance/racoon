import {
  GraphQLAPI,
  GraphQLType,
  GraphQLVariable,
  GraphQLVariableType,
  PassageElement,
} from '@/shared/types'

import { Attribute } from '../types'
import invariant from 'tiny-invariant'
import { parseLink } from './parse-link'

const VARIABLE_TYPE_MAP = Object.values(GraphQLVariableType)
const parseVariableType = (asType: string) => {
  if (VARIABLE_TYPE_MAP.includes(asType as GraphQLVariableType)) {
    return asType as GraphQLVariableType
  }

  throw new Error(`${PassageElement.GraphQLVariable}: invalid variable type ${asType}`)
}

const parseVariable = (element: Element): GraphQLVariable => {
  const key = element.getAttribute(Attribute.Key)
  const fromKey = element.getAttribute(Attribute.From)
  const asType = element.getAttribute(Attribute.As)

  invariant(key, `${PassageElement.GraphQLVariable}: key attribute is required`)
  invariant(fromKey, `${PassageElement.GraphQLVariable}: from attribute is required`)
  invariant(asType, `${PassageElement.GraphQLVariable}: as attribute is required`)

  return { key, from: fromKey, as: parseVariableType(asType) }
}

const GRAPHQL_TYPE_MAP: Record<GraphQLType, GraphQLType> = {
  [PassageElement.GraphQLQuery]: PassageElement.GraphQLQuery,
  [PassageElement.GraphQLMutation]: PassageElement.GraphQLMutation,
}

const parseGraphQLType = (rawType: string) => {
  const type = GRAPHQL_TYPE_MAP[rawType as GraphQLType]
  if (type) return type
  throw new Error(`Invalid GraphQL type: ${rawType}`)
}

const parseResult = (element: Element) => {
  const key = element.getAttribute(Attribute.Key)
  const asKey = element.getAttribute(Attribute.As)

  invariant(key, `${PassageElement.GraphQLResult}: key attribute is required`)
  invariant(asKey, `${PassageElement.GraphQLResult}: as attribute is required`)

  return { key, as: asKey }
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
  const variables = Array.from(variableElements).map(parseVariable)

  const resultElements = element.getElementsByTagName(PassageElement.GraphQLResult)
  const results = Array.from(resultElements).map(parseResult)

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
