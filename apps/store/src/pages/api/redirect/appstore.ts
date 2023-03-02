import { getCookie } from 'cookies-next'
import { NextApiRequest, NextApiResponse } from 'next'
import { getMobilePlatform } from '@/utils/getMobilePlatform'
import { LOCALE_COOKIE_KEY, FALLBACK_LOCALE } from '@/utils/l10n/locales'
import {
  isIsoLocale,
  isRoutingLocale,
  toIsoLocale,
  toRoutingLocale,
} from '@/utils/l10n/localeUtils'
import type { RoutingLocale } from '@/utils/l10n/types'
import { ORIGIN_URL, PageLink } from '@/utils/PageLink'

const handler = (req: NextApiRequest, res: NextApiResponse<void>) => {
  console.debug('QR code | Initiating redirect to AppStore')
  const cookieLocale = getCookie(LOCALE_COOKIE_KEY, { req, res })
  const acceptLocale = parseAcceptLanguage(req.headers['accept-language'] ?? '')
  const fallbackLocale = toRoutingLocale(acceptLocale ?? FALLBACK_LOCALE)
  const locale = isRoutingLocale(cookieLocale) ? cookieLocale : fallbackLocale
  console.info(`QR code | Redirect to AppStore in ${locale}`)

  const platform = getMobilePlatform(req.headers['user-agent'] ?? '')

  if (platform) {
    console.info(`QR code | Redirect to ${platform} app store`)
    const destination = appStoreLinks[platform](locale)
    return res.redirect(destination.toString())
  }

  console.info(`QR code | Redirect to home page: ${req.headers['user-agent']}`)
  const destination = new URL(ORIGIN_URL)
  destination.pathname = PageLink.home({ locale })
  return res.redirect(destination.toString())
}

export default handler

const parseAcceptLanguage = (acceptLanguage: string) => {
  const languages = acceptLanguage.split(',').map((language) => {
    const [locale, weight] = language.split(';q=')
    return { locale, weight: weight ? parseFloat(weight) : 1 }
  })
  const sortedLanguages = languages.sort((a, b) => b.weight - a.weight)
  const locales = sortedLanguages.map((language) => language.locale)
  return locales.find(isIsoLocale)
}

const appStoreLinks = {
  apple: (locale: RoutingLocale) => {
    const url = new URL('https://apps.apple.com/se/app/id1303668531')
    url.searchParams.set('l', toAppleLocale(locale))
    return url
  },
  google: (locale: RoutingLocale) => {
    const url = new URL('https://play.google.com/store/apps/details?id=com.hedvig.app')
    url.searchParams.set('hl', toIsoLocale(locale))
    return url
  },
} as const

const toAppleLocale = (locale: RoutingLocale) => {
  switch (locale) {
    case 'se':
      return 'se'
    case 'no':
      return 'no'
    case 'dk':
      return 'dk'
    default:
      return 'en'
  }
}
