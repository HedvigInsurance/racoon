import { NumberAction, PassageElement } from '@/shared/types'

import invariant from 'tiny-invariant'
import { parseLabel } from './parse-label'
import { parseLink } from './parse-link'

export const parseNumberAction = (element: Element): NumberAction => {
  const key = element.getAttribute('key')
  const placeholder = element.getAttribute('placeholder')
  const link = element.getAttribute('next')
  const unit = element.getAttribute('unit')
  const rawMinValue = element.getAttribute('minvalue')
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
