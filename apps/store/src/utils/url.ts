import { ORIGIN_URL } from '@/utils/PageLink'

// Matches against typical structures of absolute URLs - like http, https, ftp, etc. - followed by ://
export const makeAbsolute = (url: string) => {
  if (/^(?:[a-zA-Z]+:)?\/\//.test(url)) {
    return url
  }
  return new URL(url, ORIGIN_URL).href
}

export const isSameLink = (urlA: string, urlB: string) => {
  return makeAbsolute(urlA) === makeAbsolute(urlB)
}
