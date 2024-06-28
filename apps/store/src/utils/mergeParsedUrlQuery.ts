import type { ParsedUrlQuery } from 'querystring'
import { ORIGIN_URL } from './url'

export const mergeParsedUrlQuery = (linkUrl: string, search: ParsedUrlQuery): string => {
  const url = new URL(linkUrl, ORIGIN_URL)

  Object.entries(search).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, item))
    } else if (typeof value === 'string') {
      url.searchParams.set(key, value)
    } else {
      url.searchParams.set(key, '')
    }
  })

  return url.href.replace(ORIGIN_URL, '')
}
