import { getCookie } from 'cookies-next'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAppStoreLink } from '@/utils/appStoreLinks'
import { getMobilePlatform } from '@/utils/getMobilePlatform'
import { LOCALE_COOKIE_KEY, FALLBACK_LOCALE } from '@/utils/l10n/locales'
import { isIsoLocale, isRoutingLocale, toRoutingLocale } from '@/utils/l10n/localeUtils'

const FALLBACK_APP_LINK = 'https://hedvig.page.link/home_app_fallback_se'

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
    res.redirect(getAppStoreLink(platform, locale).toString())
    return
  }

  console.info(`QR code | Fallback redirect: ${req.headers['user-agent']}`)
  res.redirect(FALLBACK_APP_LINK)
  return
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
