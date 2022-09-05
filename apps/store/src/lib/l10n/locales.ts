import { Language, Locale } from './types'

export const FALLBACK_LOCALE: Locale = Locale.EnSe

export type LocaleData = {
  path: Locale
  locale: Locale
  language: Language
  currencyLocale: 'en-SE' | 'sv-SE' | 'en-NO' | 'nb-NO' | 'en-DK' | 'da-DK'
}

export const locales: Record<Locale, LocaleData> = {
  'sv-se': {
    path: Locale.SvSe,
    locale: Locale.SvSe,
    language: Language.Sv,
    currencyLocale: 'sv-SE',
  },
  'en-se': {
    path: Locale.EnSe,
    locale: Locale.EnSe,
    language: Language.En,
    currencyLocale: 'en-SE',
  },
  'nb-no': {
    path: Locale.NbNo,
    locale: Locale.NbNo,
    language: Language.No,
    currencyLocale: 'nb-NO',
  },
  'en-no': {
    path: Locale.EnNo,
    locale: Locale.EnNo,
    language: Language.En,
    currencyLocale: 'en-NO',
  },
  'da-dk': {
    path: Locale.DaDk,
    locale: Locale.DaDk,
    language: Language.Da,
    currencyLocale: 'da-DK',
  },
  'en-dk': {
    path: Locale.EnDk,
    locale: Locale.EnDk,
    language: Language.En,
    currencyLocale: 'en-DK',
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

export const getLocale = (locale: Locale | string | undefined) => {
  return locales[locale as Locale] ?? locales[FALLBACK_LOCALE]
}
