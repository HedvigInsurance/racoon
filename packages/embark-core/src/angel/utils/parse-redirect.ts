import { Attribute } from '../types'
import { Redirect } from '@/shared/types'
import invariant from 'tiny-invariant'
import { parseLink } from './parse-link'
import { parseWhen } from './parse-when'

export const parseRedirect = (element: Element): Redirect => {
  const link = element.getAttribute(Attribute.ToLink)
  const when = element.getAttribute(Attribute.When)
  const key = element.getAttribute(Attribute.Key)
  const value = element.getAttribute(Attribute.Value)

  invariant(typeof link === 'string', `Redirect must have a ${Attribute.ToLink} attribute`)
  invariant(typeof when === 'string', `Redirect must have a ${Attribute.When} attribute`)

  return {
    link: parseLink(link),
    conditions: parseWhen(when),
    key: key ?? undefined,
    value: value ?? undefined,
  }
}
