import type { NextParsedUrlQuery } from 'next/dist/server/request-meta'

export const singleQueryParam = (query: NextParsedUrlQuery, key: string): string | undefined => {
  const val = query[key]
  if (Array.isArray(val)) {
    return val[0]
  }
  return val
}
