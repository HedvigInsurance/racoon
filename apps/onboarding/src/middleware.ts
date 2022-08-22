import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/
const INTERNAL_ROUTE = /_next\/(.*)$/
const DEFAULT_PATH_LOCALE = 'se-en'

const CAMPAIGN_CODE_COOKIE_KEY = '_hvcode'
const CAMPAIGN_CODE_QUERY_PARAM = 'code'

// https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
const SUPPORTED_MARKETS = ['se', 'dk', 'no']

const guessLocale = (request: NextRequest) => {
  const requestCountry = request.geo?.country?.toLowerCase()

  if (requestCountry && SUPPORTED_MARKETS.includes(requestCountry)) {
    const requestLanguage = request.headers.get('accept-language')?.split(',')?.[0].toLowerCase()

    switch (requestCountry) {
      case 'se':
        return requestLanguage?.includes('sv') ? 'se' : 'se-en'
      case 'dk':
        return requestLanguage?.includes('da') ? 'dk' : 'dk-en'
      case 'no':
        return requestLanguage?.includes('nb') || requestLanguage?.includes('nn') ? 'no' : 'no-en'
    }
  }

  return null
}

const localeRedirectMiddleware = (request: NextRequest) => {
  const shouldHandleLocale =
    !PUBLIC_FILE.test(request.nextUrl.pathname) &&
    !INTERNAL_ROUTE.test(request.nextUrl.pathname) &&
    !request.nextUrl.pathname.includes('/api/') &&
    request.nextUrl.locale === 'default'

  if (!shouldHandleLocale) return null

  const locale = guessLocale(request) || DEFAULT_PATH_LOCALE

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${request.nextUrl.pathname}`

  return NextResponse.redirect(url)
}

const campaignCodeMiddleware = (request: NextRequest) => {
  const campaignCode = request.nextUrl.searchParams.get(CAMPAIGN_CODE_QUERY_PARAM)

  if (!campaignCode) return null

  console.info('Adding campaign code from URL:', campaignCode)
  const response = NextResponse.next()
  response.cookies.set(CAMPAIGN_CODE_COOKIE_KEY, campaignCode)
  return response
}

export function middleware(request: NextRequest): NextResponse {
  try {
    const localeResponse = localeRedirectMiddleware(request)
    if (localeResponse) return localeResponse

    const campaignCodeResponse = campaignCodeMiddleware(request)
    if (campaignCodeResponse) return campaignCodeResponse
  } catch (error) {
    console.error('Unknown error', error)
  }

  return NextResponse.next()
}
