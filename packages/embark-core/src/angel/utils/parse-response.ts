import { Message } from '@/shared/types'
import invariant from 'tiny-invariant'
import { parseLabel } from './parse-label'

export const parseResponse = (element: Element): Message => {
  invariant(typeof element.textContent === 'string')

  return {
    label: parseLabel(element.textContent.trim()),
  }
}
