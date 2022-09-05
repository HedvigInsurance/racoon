import { birthDateFormats, ssnFormats, ssnLengths } from './birth-date-and-ssn-formats'
import { HtmlLanguage, Locale } from './types'

export const FALLBACK_LOCALE: Locale = Locale.EnSe

export type LocaleData = {
  path: Locale
  locale: Locale
  htmlLang: HtmlLanguage
  ssn: {
    length: number
    formatExample: string
    formatRegex: RegExp
  }
  birthDate: {
    formatExample: string
    formatRegex: RegExp
    backendFormatExample: string
  }
  currencyLocale: Locale
}

export const locales: Record<Locale, LocaleData> = {
  'sv-se': {
    path: Locale.SvSe,
    locale: Locale.SvSe,
    htmlLang: HtmlLanguage.Sv,
    ssn: {
      length: ssnLengths.SE,
      formatExample: 'ÅÅÅÅMMDDXXXX',
      formatRegex: ssnFormats.SE,
    },
    birthDate: {
      formatExample: 'ÅÅÅÅ-MM-DD',
      formatRegex: birthDateFormats.SE,
      backendFormatExample: 'ÅÅÅÅ-MM-DD',
    },
    currencyLocale: Locale.SvSe,
  },
  'en-se': {
    path: Locale.EnSe,
    locale: Locale.EnSe,
    htmlLang: HtmlLanguage.En,
    ssn: {
      length: ssnLengths.SE,
      formatExample: 'YYYYMMDDXXXX',
      formatRegex: ssnFormats.SE,
    },
    birthDate: {
      formatExample: 'YYYY-MM-DD',
      formatRegex: birthDateFormats.SE,
      backendFormatExample: 'YYYY-MM-DD',
    },
    currencyLocale: Locale.EnSe,
  },
  'nb-no': {
    path: Locale.NbNo,
    locale: Locale.NbNo,
    htmlLang: HtmlLanguage.No,
    ssn: {
      length: ssnLengths.NO,
      formatExample: 'DDMMÅÅXXXXX',
      formatRegex: ssnFormats.NO,
    },
    birthDate: {
      formatExample: 'DD-MM-ÅÅÅÅ',
      formatRegex: birthDateFormats.NO,
      backendFormatExample: 'ÅÅÅÅ-MM-DD',
    },
    currencyLocale: Locale.NbNo,
  },
  'en-no': {
    path: Locale.EnNo,
    locale: Locale.EnNo,
    htmlLang: HtmlLanguage.En,
    ssn: {
      length: ssnLengths.NO,
      formatExample: 'DDMMYYXXXXX',
      formatRegex: ssnFormats.NO,
    },
    birthDate: {
      formatExample: 'DD-MM-YYYY',
      formatRegex: birthDateFormats.NO,
      backendFormatExample: 'YYYY-MM-DD',
    },
    currencyLocale: Locale.EnNo,
  },
  'da-dk': {
    path: Locale.DaDk,
    locale: Locale.DaDk,
    htmlLang: HtmlLanguage.Da,
    ssn: {
      length: ssnLengths.DK,
      formatExample: 'DDMMÅÅSSSS',
      formatRegex: ssnFormats.DK,
    },
    birthDate: {
      formatExample: 'DD-MM-ÅÅÅÅ',
      formatRegex: birthDateFormats.DK,
      backendFormatExample: 'ÅÅÅÅ-MM-DD',
    },
    currencyLocale: Locale.DaDk,
  },
  'en-dk': {
    path: Locale.DaDk,
    locale: Locale.EnDk,
    htmlLang: HtmlLanguage.En,
    ssn: {
      length: ssnLengths.DK,
      formatExample: 'DDMMYYSSSS',
      formatRegex: ssnFormats.DK,
    },
    birthDate: {
      formatExample: 'DD-MM-YYYY',
      formatRegex: birthDateFormats.DK,
      backendFormatExample: 'YYYY-MM-DD',
    },
    currencyLocale: Locale.EnDk,
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
