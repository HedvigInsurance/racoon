import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/
const INTERNAL_ROUTE = /_next\/(.*)$/
const DEFAULT_PATH_LOCALE = 'se-en'

const CAMPAIGN_CODE_COOKIE_KEY = '_hvcode'
const CAMPAIGN_CODE_QUERY_PARAM = 'code'

const BASIC_AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD
const BASIC_AUTH_ENABLED = process.env.BASIC_AUTH_ENABLED === 'true'

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

const localeRedirectMiddleware = async (request: NextRequest) => {
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

const basicAuthMiddleware = (request: NextRequest) => {
  if (PUBLIC_FILE.test(request.nextUrl.pathname) || INTERNAL_ROUTE.test(request.nextUrl.pathname)) {
    return null
  }

  const basicAuth = request.headers.get('authorization')
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [username, password] = atob(authValue).split(':')

    if (username === BASIC_AUTH_USERNAME && password === BASIC_AUTH_PASSWORD) {
      return null
    }
  }

  const url = request.nextUrl.clone()
  url.pathname = '/api/auth'
  return NextResponse.rewrite(url)
}

const campaignCodeMiddleware = (request: NextRequest) => {
  const campaignCode = request.nextUrl.searchParams.get(CAMPAIGN_CODE_QUERY_PARAM)

  if (!campaignCode) return null

  const response = NextResponse.next()
  response.cookies.set(CAMPAIGN_CODE_COOKIE_KEY, campaignCode)
  return response
}

export async function middleware(request: NextRequest) {
  try {
    if (BASIC_AUTH_ENABLED) {
      const authResponse = basicAuthMiddleware(request)
      if (authResponse) return authResponse
    }

    const localeResponse = localeRedirectMiddleware(request)
    if (localeResponse) return localeResponse

    const campaignCodeResponse = campaignCodeMiddleware(request)
    if (campaignCodeResponse) return campaignCodeResponse
  } catch (error) {
    console.error('Unknown error', error)
  }

  return NextResponse.next()
}
