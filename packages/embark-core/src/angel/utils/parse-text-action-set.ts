import { PassageElement, TextActionSet } from '@/shared/types'

import invariant from 'tiny-invariant'
import { parseBaseTextAction } from './parse-base-text-action'
import { parseLink } from './parse-link'

export const parseTextActionSet = (element: Element): TextActionSet => {
  const textActionElements = element.getElementsByTagName(PassageElement.TextAction)
  const link = element.getAttribute('next')

  invariant(typeof link === 'string')

  return {
    type: PassageElement.TextActionSet,
    link: parseLink(link),
    actions: Array.from(textActionElements).map(parseBaseTextAction),
  }
}
