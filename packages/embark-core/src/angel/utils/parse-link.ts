import { Link } from '@/shared/types'
import { parseLabel } from './parse-label'

export const parseLink = (text: string): Link => {
  const differentName = text.match(/\[\[(.*?)\->(.*?)\]\]/)

  if (differentName) {
    return {
      label: parseLabel(differentName[1]),
      to: differentName[2],
    }
  } else {
    const actualLink = text.substring(2, text.length - 2)
    return {
      label: parseLabel(actualLink),
      to: actualLink,
    }
  }
}
