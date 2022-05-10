import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getLocale } from '@/lib/l10n'
import type { LocaleLabel } from '@/lib/l10n/locales'
import { Market } from '@/lib/types'
import { graphqlSdk } from '@/services/graphql/sdk'

const PUBLIC_FILE = /\.(.*)$/
const DEFAULT_PATH_LOCALE = 'se-en'

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
if (!GRAPHQL_ENDPOINT) throw new Error('NEXT_PUBLIC_GRAPHQL_ENDPOINT is not set')

const QUOTE_CART_COOKIE_KEY = '_hv_onboarding_quote_cart'
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

type ValidateQuoteCartParams = {
  id: string
  market: Market
}

export const validateQuoteCart = async ({ id, market }: ValidateQuoteCartParams) => {
  const { quoteCart } = await graphqlSdk.QuoteCartStatus({ id })
  return quoteCart.market === market && !quoteCart.checkout
}

const quoteCartSessionMiddleware = async (req: NextRequest, res: NextResponse) => {
  let quoteCartId: string | undefined = req.cookies[QUOTE_CART_COOKIE_KEY]
  const { apiMarket, isoLocale } = getLocale(req.nextUrl.locale as LocaleLabel)

  if (quoteCartId) {
    const isValid = await validateQuoteCart({ id: quoteCartId, market: apiMarket })
    quoteCartId = isValid ? quoteCartId : undefined
  }

  if (quoteCartId === undefined) {
    const quoteCart = await graphqlSdk.CreateQuoteCart({ market: apiMarket, locale: isoLocale })
    res.cookie(QUOTE_CART_COOKIE_KEY, quoteCart.onboardingQuoteCart_create.id)
  }
}

const campaignCodeMiddleware = (req: NextRequest, res: NextResponse) => {
  const campaignCode = req.nextUrl.searchParams.get(CAMPAIGN_CODE_QUERY_PARAM)
  if (campaignCode) {
    res.cookie(CAMPAIGN_CODE_COOKIE_KEY, campaignCode)
  }
}

export async function middleware(req: NextRequest) {
  const isPageRoute =
    !PUBLIC_FILE.test(req.nextUrl.pathname) && !req.nextUrl.pathname.includes('/api/')

  const shouldHandleLocale = isPageRoute && req.nextUrl.locale === 'default'

  try {
    if (shouldHandleLocale) return localeRedirectMiddleware(req)
    if (isPageRoute) {
      const response = NextResponse.next()
      await quoteCartSessionMiddleware(req, response)
      campaignCodeMiddleware(req, response)
      return response
    }
  } catch (error) {
    console.error('Unknown error', error)
  }

  return undefined
}
