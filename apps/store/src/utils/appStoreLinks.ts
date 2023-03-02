import { toIsoLocale } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'

const APP_STORE_LINK = {
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

type Platform = keyof typeof APP_STORE_LINK

export const getAppStoreLink = (platform: Platform, locale: RoutingLocale) => {
  return APP_STORE_LINK[platform](locale)
}

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
