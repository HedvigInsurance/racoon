import { HtmlLanguage, Locale } from './types'

export const FALLBACK_LOCALE: Locale = Locale.EnSe

export type LocaleData = {
  path: Locale
  locale: Locale
  htmlLang: HtmlLanguage
}

export const locales: Record<Locale, LocaleData> = {
  'sv-se': {
    path: Locale.SvSe,
    locale: Locale.SvSe,
    htmlLang: HtmlLanguage.Sv,
  },
  'en-se': {
    path: Locale.EnSe,
    locale: Locale.EnSe,
    htmlLang: HtmlLanguage.En,
  },
  'nb-no': {
    path: Locale.NbNo,
    locale: Locale.NbNo,
    htmlLang: HtmlLanguage.No,
  },
  'en-no': {
    path: Locale.EnNo,
    locale: Locale.EnNo,
    htmlLang: HtmlLanguage.En,
  },
  'da-dk': {
    path: Locale.DaDk,
    locale: Locale.DaDk,
    htmlLang: HtmlLanguage.Da,
  },
  'en-dk': {
    path: Locale.DaDk,
    locale: Locale.EnDk,
    htmlLang: HtmlLanguage.En,
  },
}

// TODO: Move to Lokalise
export const TEMP_TRANSLATIONS: Record<string, string> = {
  MARKET_LABEL_SE: 'Sweden',
  MARKET_LABEL_NO: 'Norway',
  MARKET_LABEL_DK: 'Denmark',

  LANGUAGE_LABEL_sv: 'Swedish',
  LANGUAGE_LABEL_en: 'English',
  LANGUAGE_LABEL_no: 'Norwegian',
  LANGUAGE_LABEL_da: 'Danish',
}

export enum LocaleField {
  Market = 'market',
  Language = 'language',
}

export const getLocale = (locale: Locale | string | undefined) => {
  return locales[locale as Locale] ?? locales[FALLBACK_LOCALE]
}
