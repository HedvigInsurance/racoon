import { Attribute } from './../types'
import { PassageElement } from '@/shared/types'
import invariant from 'tiny-invariant'

export const parseGraphQLResult = (element: Element) => {
  const key = element.getAttribute(Attribute.Key)
  const asKey = element.getAttribute(Attribute.As)

  invariant(key, `${PassageElement.GraphQLResult}: key attribute is required`)
  invariant(asKey, `${PassageElement.GraphQLResult}: as attribute is required`)

  return { key, as: asKey }
}
