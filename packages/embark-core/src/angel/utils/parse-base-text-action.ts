import { BaseTextAction, PassageElement } from '@/shared/types'

import invariant from 'tiny-invariant'
import { parseLabel } from './parse-label'

export const parseBaseTextAction = (element: Element): BaseTextAction => {
  const key = element.getAttribute('key')
  const title = element.getAttribute('title')
  const placeholder = element.getAttribute('placeholder')
  const isLarge = element.getAttribute('large') === 'true'
  const mask = element.getAttribute('mask') || undefined

  invariant(typeof key === 'string')
  invariant(typeof title === 'string')

  return {
    type: PassageElement.TextAction,
    key,
    title: parseLabel(title),
    placeholder: placeholder ? parseLabel(placeholder) : undefined,
    size: isLarge ? 'large' : 'small',
    mask,
  }
}
