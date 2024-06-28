export const ORIGIN_URL =
  process.env.NEXT_PUBLIC_ORIGIN_URL ??
  (process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:8040')

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

export const appendAnchor = (url: string, anchor?: string) => (anchor ? `${url}#${anchor}` : url)

export const removeTrailingSlash = (url: string) => {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

export const removeSEHomepageLangSegment = (urlString: string): string => {
  const url = new URL(removeTrailingSlash(urlString))

  const isSwedishHomepage = url.pathname === '/se'

  if (isSwedishHomepage) {
    url.pathname = '/'
  }

  return removeTrailingSlash(url.toString())
}
