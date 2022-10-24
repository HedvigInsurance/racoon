import { FALLBACK_LOCALE, LocaleData, locales } from '@/utils/l10n/locales'
import { IsoLocale, RoutingLocale, UiLocale } from '@/utils/l10n/types'

const routingToIsoLocales = {} as { [key in RoutingLocale]: IsoLocale }
const isoToRoutingLocales = {} as { [key in IsoLocale]: RoutingLocale }
Object.values(locales).forEach((localeData) => {
  const { locale: isoLocale, routingLocale } = localeData
  routingToIsoLocales[routingLocale] = isoLocale
  isoToRoutingLocales[isoLocale] = routingLocale
})

export const toIsoLocale = (locale: UiLocale): IsoLocale => {
  if (isRoutingLocale(locale)) return routingToIsoLocales[locale]
  return locale
}

export const toRoutingLocale = (locale: UiLocale): RoutingLocale => {
  if (isIsoLocale(locale)) return isoToRoutingLocales[locale]
  return locale
}

export const isIsoLocale = (locale: unknown): locale is IsoLocale => {
  return typeof locale === 'string' && locale in isoToRoutingLocales
}

export const isRoutingLocale = (locale: unknown): locale is RoutingLocale => {
  return typeof locale === 'string' && locale in routingToIsoLocales
}

// Fallback is global, use country.defaultLocale for country-specific fallback
export const getLocaleOrFallback = (locale: UiLocale | string | undefined): LocaleData => {
  if (!isRoutingLocale(locale) && !isIsoLocale(locale)) {
    return locales[FALLBACK_LOCALE]
  }
  return locales[toIsoLocale(locale)]
}
