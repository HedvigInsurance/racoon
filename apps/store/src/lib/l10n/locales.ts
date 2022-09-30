import { countries } from '@/lib/l10n/countries'
import { isSupportedLocale } from '@/utils/isSupportedLocale'
import routingLocales from '../../routingLocales'
import { CountryLabel, IsoLocale, Language, Locale, RoutingLocale, UiLocale } from './types'

export const FALLBACK_LOCALE = Locale.EnSe

export type LocaleData = {
  locale: IsoLocale
  language: Language
}

export const locales: Record<IsoLocale, LocaleData> = {
  [Locale.SvSe]: {
    locale: Locale.SvSe,
    language: Language.Sv,
  },
  [Locale.EnSe]: {
    locale: Locale.EnSe,
    language: Language.En,
  },
  [Locale.NbNo]: {
    locale: Locale.NbNo,
    language: Language.No,
  },
  [Locale.EnNo]: {
    locale: Locale.EnNo,
    language: Language.En,
  },
  [Locale.DaDk]: {
    locale: Locale.DaDk,
    language: Language.Da,
  },
  [Locale.EnDk]: {
    locale: Locale.EnDk,
    language: Language.En,
  },
}

// TODO: Move to Lokalise
export const TEMP_TRANSLATIONS: Record<string, string> = {
  COUNTRY_LABEL_SE: 'Sweden',
  COUNTRY_LABEL_NO: 'Norway',
  COUNTRY_LABEL_DK: 'Denmark',

  LANGUAGE_LABEL_sv: 'Swedish',
  LANGUAGE_LABEL_en: 'English',
  LANGUAGE_LABEL_no: 'Norwegian',
  LANGUAGE_LABEL_da: 'Danish',
}

export enum LocaleField {
  Country = 'country',
  Language = 'language',
}

const routingToIsoLocales = {} as { [key in RoutingLocale]: IsoLocale }
const isoToRoutingLocales = {} as { [key in IsoLocale]: RoutingLocale }
routingLocales.forEach((routingLocale) => {
  let isoLocale: IsoLocale
  if (routingLocale.length === 2) {
    const countryData = countries[routingLocale.toUpperCase() as CountryLabel]
    if (countryData) {
      isoLocale = countryData.defaultLocale
    } else {
      throw new Error(
        `Incorrect configuration, failed to find country by routing locale <${routingLocale}>`,
      )
    }
  }
  const localeParts = routingLocale.split('-', 2)
  isoLocale = `${localeParts[0].toLowerCase()}-${localeParts[1].toUpperCase()}` as IsoLocale
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

export const isIsoLocale = (locale: string): locale is IsoLocale => {
  return locale in isoToRoutingLocales
}

export const isRoutingLocale = (locale: string): locale is RoutingLocale => {
  return locale in routingToIsoLocales
}

// TODO: Make fallback market-specific
export const getLocaleOrFallback = (locale: UiLocale | string | undefined): LocaleData => {
  if (!isSupportedLocale(locale)) {
    return locales[FALLBACK_LOCALE]
  }
  return locales[toIsoLocale(locale)]
}
