import { FALLBACK_LOCALE, locales } from './locales'
import { Locale } from './types'

export const getLocale = (locale: Locale | string | undefined) => {
  const localeData = locales[locale as Locale] ?? locales[FALLBACK_LOCALE]

  return localeData
}
