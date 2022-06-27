import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/
const DEFAULT_PATH_LOCALE = 'se-en'

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
if (!GRAPHQL_ENDPOINT) throw new Error('NEXT_PUBLIC_GRAPHQL_ENDPOINT is not set')

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

const localeRedirectMiddleware = async (req: NextRequest) => {
  const locale = guessLocale(req) || DEFAULT_PATH_LOCALE
  return NextResponse.redirect(
    `${req.nextUrl.origin}/${locale}${req.nextUrl.pathname.replace('/default', '')}`,
  )
}

export async function middleware(req: NextRequest) {
  const isPageRoute =
    !PUBLIC_FILE.test(req.nextUrl.pathname) && !req.nextUrl.pathname.includes('/api/')

  const shouldHandleLocale = isPageRoute && req.nextUrl.locale === 'default'

  try {
    if (shouldHandleLocale) return localeRedirectMiddleware(req)
    if (isPageRoute) {
      const campaignCode = req.nextUrl.searchParams.get(CAMPAIGN_CODE_QUERY_PARAM)
      if (campaignCode) {
        return NextResponse.next().cookie(CAMPAIGN_CODE_COOKIE_KEY, campaignCode)
      }
    }
  } catch (error) {
    console.error('Unknown error', error)
  }

  return undefined
}
