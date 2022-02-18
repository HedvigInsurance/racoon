import { NumberAction, PassageElement } from '@/shared/types'

import { Attribute } from '../types'
import invariant from 'tiny-invariant'
import { parseLabel } from './parse-label'
import { parseLink } from './parse-link'

export const parseNumberAction = (element: Element): NumberAction => {
  const key = element.getAttribute(Attribute.Key)
  const placeholder = element.getAttribute(Attribute.Placeholder)
  const link = element.getAttribute(Attribute.NextLink)
  const unit = element.getAttribute(Attribute.Unit)
  const rawMinValue = element.getAttribute(Attribute.MinValue)
  const minValue = rawMinValue ? parseInt(rawMinValue, 10) : undefined

  invariant(typeof key === 'string')
  invariant(typeof link === 'string')
  invariant(typeof unit === 'string')

  return {
    type: PassageElement.NumberAction,
    key,
    link: parseLink(link),
    unit: parseLabel(unit),
    placeholder: placeholder ? parseLabel(placeholder) : undefined,
    minValue,
  }
}
