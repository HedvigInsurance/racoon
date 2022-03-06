import { PassageElement, Tooltip } from '@/shared/types'

import invariant from 'tiny-invariant'
import { parseLabel } from './parse-label'

export const parseTooltip = (element: Element): Tooltip => {
  const titleElements = element.getElementsByTagName(PassageElement.TooltipTitle)
  invariant(titleElements.length === 1)
  const titleElement = titleElements[0]
  invariant(typeof titleElement.textContent === 'string')

  const descriptionElements = element.getElementsByTagName(PassageElement.TooltipDescription)
  invariant(descriptionElements.length === 1)
  const descriptionElement = descriptionElements[0]
  invariant(typeof descriptionElement.textContent === 'string')

  return {
    title: parseLabel(titleElement.textContent.trim()),
    description: parseLabel(descriptionElement.textContent.trim()),
  }
}
