import { BaseTextAction, PassageElement, TextActionMask } from '@/shared/types'

import { Attribute } from '../types'
import invariant from 'tiny-invariant'
import { parseLabel } from './parse-label'

const isTextActionMask = (raw: unknown): raw is TextActionMask => {
  return typeof raw === 'string' && (raw as TextActionMask) in TextActionMask
}

export const parseBaseTextAction = (element: Element): BaseTextAction => {
  const key = element.getAttribute(Attribute.Key)
  const title = element.getAttribute(Attribute.Title)
  const placeholder = element.getAttribute(Attribute.Placeholder)
  const isLarge = element.getAttribute(Attribute.IsLarge) === 'true'
  const mask = element.getAttribute(Attribute.Mask) || undefined

  invariant(typeof key === 'string')
  invariant(typeof title === 'string')

  return {
    type: PassageElement.TextAction,
    key,
    title: parseLabel(title),
    placeholder: placeholder ? parseLabel(placeholder) : undefined,
    size: isLarge ? 'large' : 'small',
    mask: isTextActionMask(mask) ? mask : undefined,
  }
}
