import { GraphQLVariable, PassageElement } from '@/shared/types'

import { Attribute } from '../types'
import invariant from 'tiny-invariant'
import { parseGraphQLVariableType } from './parse-graphql-variable-type'

export const parseGraphQLVariable = (element: Element): GraphQLVariable => {
  const key = element.getAttribute(Attribute.Key)
  const fromKey = element.getAttribute(Attribute.From)
  const asType = element.getAttribute(Attribute.As)

  invariant(key, `${PassageElement.GraphQLVariable}: key attribute is required`)
  invariant(fromKey, `${PassageElement.GraphQLVariable}: from attribute is required`)
  invariant(asType, `${PassageElement.GraphQLVariable}: as attribute is required`)

  return {
    type: PassageElement.GraphQLVariable,
    key,
    from: fromKey,
    as: parseGraphQLVariableType(asType),
  }
}
