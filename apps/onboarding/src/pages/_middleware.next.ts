import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getLocale } from '@/lib/l10n'
import type { LocaleLabel } from '@/lib/l10n/locales'
import { QuoteCart } from '@/services/quote-cart'

const PUBLIC_FILE = /\.(.*)$/

const DEFAULT_PATH_LOCALE = 'se-en'

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

const quoteCartSessionMiddleware = async (req: NextRequest, res: NextResponse) => {
  let onboardingQuoteCartId: string | undefined = req.cookies[QuoteCart.COOKIE_KEY]
  const { apiMarket, isoLocale } = getLocale(req.nextUrl.locale as LocaleLabel)

  if (onboardingQuoteCartId) {
    const isValid = await QuoteCart.validate({
      id: onboardingQuoteCartId,
      market: apiMarket,
    })
    onboardingQuoteCartId = isValid ? onboardingQuoteCartId : undefined
  }

  if (onboardingQuoteCartId === undefined) {
    const id = await QuoteCart.create({ locale: isoLocale, market: apiMarket })
    res.cookie(QuoteCart.COOKIE_KEY, id)
  }
}

const campaignCodeMiddleware = (req: NextRequest, res: NextResponse) => {
  const campaignCode = req.nextUrl.searchParams.get(QuoteCart.CAMPAIGN_CODE_QUERY_PARAM)
  if (campaignCode) {
    res.cookie(QuoteCart.CAMPAIGN_CODE_COOKIE_KEY, campaignCode)
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
