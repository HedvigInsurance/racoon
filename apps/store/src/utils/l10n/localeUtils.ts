import { TFunction } from 'next-i18next'
import { FALLBACK_LOCALE, LocaleData, locales } from '@/utils/l10n/locales'
import { CountryCode, IsoLocale, Language, RoutingLocale, UiLocale } from '@/utils/l10n/types'

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

export const toApiLocale = (locale: UiLocale): string => {
  const isoLocale = toIsoLocale(locale)
  return isoLocale.replace('-', '_')
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

export const translateCountryName = (countryCode: CountryCode, t: TFunction) => {
  switch (countryCode) {
    case CountryCode.Dk:
      return t('COUNTRY_LABEL_DK')
    case CountryCode.No:
      return t('COUNTRY_LABEL_NO')
    case CountryCode.Se:
      return t('COUNTRY_LABEL_SE')
    default:
      return `MISSING ${countryCode}`
  }
}

export const translateLanguageName = (language: Language, t: TFunction) => {
  switch (language) {
    case Language.Da:
      return t('LANGUAGE_LABEL_da')
    case Language.En:
      return t('LANGUAGE_LABEL_en')
    case Language.No:
      return t('LANGUAGE_LABEL_no')
    case Language.Sv:
      return t('LANGUAGE_LABEL_sv')
    default:
      return `MISSING ${language}`
  }
}
