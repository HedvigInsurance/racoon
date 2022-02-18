import { Attribute } from '../types'
import { TextAction } from '@/shared/types'
import invariant from 'tiny-invariant'
import { parseBaseTextAction } from './parse-base-text-action'
import { parseLink } from './parse-link'

export const parseTextAction = (element: Element): TextAction => {
  const baseTextAction = parseBaseTextAction(element)
  const link = element.getAttribute(Attribute.NextLink)

  invariant(typeof link === 'string')

  return {
    ...baseTextAction,
    link: parseLink(link),
  }
}
