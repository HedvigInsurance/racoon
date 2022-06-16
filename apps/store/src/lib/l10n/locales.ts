import { birthDateFormats, ssnFormats, ssnLengths } from './birth-date-and-ssn-formats'
import { PhoneNumberData, phoneNumbers } from './phone-numbers'
import { Market as ApiMarket, MarketLabel, HtmlLanguage, Locale } from './types'

export const FALLBACK_LOCALE: Locale = Locale.EnSe

export type LocaleData = {
  path: Locale
  locale: Locale
  marketLabel: MarketLabel
  apiMarket: ApiMarket
  htmlLang: HtmlLanguage
  adtractionScriptSrc?: string
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
  phoneNumber?: PhoneNumberData
  currencyLocale: Locale
}

export const locales: Record<Locale, LocaleData> = {
  'sv-se': {
    path: Locale.SvSe,
    locale: Locale.SvSe,
    marketLabel: MarketLabel.SE,
    apiMarket: ApiMarket.Sweden,
    htmlLang: HtmlLanguage.Sv,
    adtractionScriptSrc: 'https://cdn.adt387.com/jsTag?ap=1412531808',
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
    phoneNumber: phoneNumbers.SE,
    currencyLocale: Locale.SvSe,
  },
  'en-se': {
    path: Locale.EnSe,
    locale: Locale.EnSe,
    marketLabel: MarketLabel.SE,
    apiMarket: ApiMarket.Sweden,
    htmlLang: HtmlLanguage.En,
    adtractionScriptSrc: 'https://cdn.adt387.com/jsTag?ap=1412531808',
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
    phoneNumber: phoneNumbers.SE,
    currencyLocale: Locale.EnSe,
  },
  'nb-no': {
    path: Locale.NbNo,
    locale: Locale.NbNo,
    marketLabel: MarketLabel.NO,
    apiMarket: ApiMarket.Norway,
    htmlLang: HtmlLanguage.No,
    adtractionScriptSrc: 'https://cdn.adt387.com/jsTag?ap=1492109567',
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
    marketLabel: MarketLabel.NO,
    apiMarket: ApiMarket.Norway,
    htmlLang: HtmlLanguage.En,
    adtractionScriptSrc: 'https://cdn.adt387.com/jsTag?ap=1492109567',
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
    marketLabel: MarketLabel.DK,
    apiMarket: ApiMarket.Denmark,
    htmlLang: HtmlLanguage.Da,
    adtractionScriptSrc: 'https://cdn.adt387.com/jsTag?ap=1589794294',
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
    marketLabel: MarketLabel.DK,
    apiMarket: ApiMarket.Denmark,
    htmlLang: HtmlLanguage.En,
    adtractionScriptSrc: 'https://cdn.adt387.com/jsTag?ap=1589794294',
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
