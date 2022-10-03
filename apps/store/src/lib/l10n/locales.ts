import { IsoLocale, Language, Locale, RoutingLocale } from './types'

export const FALLBACK_LOCALE = Locale.EnSe

export type LocaleData = {
  locale: IsoLocale
  language: Language
  routingPath: RoutingLocale
}

export const locales: Record<IsoLocale, LocaleData> = {
  [Locale.SvSe]: {
    locale: Locale.SvSe,
    language: Language.Sv,
    routingPath: 'se',
  },
  [Locale.EnSe]: {
    locale: Locale.EnSe,
    language: Language.En,
    routingPath: 'en-se',
  },
  [Locale.NbNo]: {
    locale: Locale.NbNo,
    language: Language.No,
    routingPath: 'no',
  },
  [Locale.EnNo]: {
    locale: Locale.EnNo,
    language: Language.En,
    routingPath: 'en-no',
  },
  [Locale.DaDk]: {
    locale: Locale.DaDk,
    language: Language.Da,
    routingPath: 'dk',
  },
  [Locale.EnDk]: {
    locale: Locale.EnDk,
    language: Language.En,
    routingPath: 'en-dk',
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
