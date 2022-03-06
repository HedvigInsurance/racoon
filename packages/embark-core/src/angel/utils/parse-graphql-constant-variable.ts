import { GraphQLConstantVariable, PassageElement } from '@/shared/types'

import { Attribute } from '../types'
import invariant from 'tiny-invariant'
import { parseGraphQLVariableType } from './parse-graphql-variable-type'

export const parseGraphQLConstantVariable = (element: Element): GraphQLConstantVariable => {
  const key = element.getAttribute(Attribute.Key)
  const value = element.getAttribute(Attribute.Value)
  const asType = element.getAttribute(Attribute.As)

  invariant(key, `${PassageElement.GraphQLConstantVariable}: key attribute is required`)
  invariant(value, `${PassageElement.GraphQLConstantVariable}: value attribute is required`)
  invariant(asType, `${PassageElement.GraphQLConstantVariable}: as attribute is required`)

  return {
    type: PassageElement.GraphQLConstantVariable,
    key,
    value,
    as: parseGraphQLVariableType(asType),
  }
}
