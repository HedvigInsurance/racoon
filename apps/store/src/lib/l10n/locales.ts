import { CountryLabel, Language, Locale, LocaleValue, RoutingLocale } from './types'

export const FALLBACK_LOCALE = Locale.EnSe

export type LocaleData = {
  locale: LocaleValue
  language: Language
  countryLabel: CountryLabel
}

export const locales = {
  [Locale.SvSe]: {
    locale: Locale.SvSe,
    language: Language.Sv,
    countryLabel: CountryLabel.SE,
  },
  [Locale.EnSe]: {
    locale: Locale.EnSe,
    language: Language.En,
    countryLabel: CountryLabel.SE,
  },
  [Locale.NbNo]: {
    locale: Locale.NbNo,
    language: Language.No,
    countryLabel: CountryLabel.NO,
  },
  [Locale.EnNo]: {
    locale: Locale.EnNo,
    language: Language.En,
    countryLabel: CountryLabel.NO,
  },
  [Locale.DaDk]: {
    locale: Locale.DaDk,
    language: Language.Da,
    countryLabel: CountryLabel.DK,
  },
  [Locale.EnDk]: {
    locale: Locale.EnDk,
    language: Language.En,
    countryLabel: CountryLabel.DK,
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

export const normalizeLocale = (locale: string | undefined): string | undefined => {
  if (!locale?.includes('-')) {
    return locale
  }
  const parts = locale.split('-', 2)
  return `${parts[0].toLowerCase()}-${parts[1].toUpperCase()}`
}

// We use en-SE ISO format for settings but downcase it for routing to get nicer URLs
export const routingLocale = (locale: LocaleValue) => locale.toLowerCase() as RoutingLocale

// TODO: Make fallback market-specific
export const getLocaleOrFallback = (locale: LocaleValue | string | undefined): LocaleData => {
  return locales[normalizeLocale(locale) as LocaleValue] ?? locales[FALLBACK_LOCALE]
}
