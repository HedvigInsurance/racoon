import { PassageElement, SelectAction } from '@/shared/types'

import { Attribute } from '../types'
import invariant from 'tiny-invariant'
import { parseLink } from './parse-link'

export const parseSelectAction = (element: Element): SelectAction => {
  const optionElements = element.getElementsByTagName(PassageElement.SelectActionOption)

  return {
    type: PassageElement.SelectAction,
    options: Array.from(optionElements).map((option) => {
      const key = option.getAttribute(Attribute.Key)
      const value = option.getAttribute(Attribute.Value)

      invariant(typeof option.textContent === 'string')
      invariant(typeof key === 'string')
      invariant(typeof value === 'string')

      return {
        key,
        value,
        link: parseLink(option.textContent.trim()),
      }
    }),
  }
}
