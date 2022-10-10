import { Market as ApiMarket, Locale as IsoLocale, MarketLabel } from '@/lib/types'
import { birthDateFormats, ssnFormats, ssnLengths } from './birth-date-and-ssn-formats'
import { PhoneNumberData, phoneNumbers } from './phone-numbers'

export const LOCALE_URL_PARAMS = ['se', 'se-en', 'no', 'no-en', 'dk', 'dk-en'] as const
export type LocaleUrlParams = typeof LOCALE_URL_PARAMS
export type LocaleLabel = LocaleUrlParams[number]
export type HrefLanguage = 'en-se' | 'sv-se' | 'no-no' | 'en-no' | 'da-dk' | 'en-dk'

export type LocaleData = {
  path: LocaleLabel
  isoLocale: IsoLocale
  marketLabel: MarketLabel
  apiMarket: ApiMarket
  htmlLang: 'en' | 'sv' | 'no' | 'da'
  hrefLang: HrefLanguage
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
  currencyLocale: 'en-SE' | 'sv-SE' | 'en-NO' | 'nb-NO' | 'en-DK' | 'da-DK'
}

export const locales: Record<LocaleLabel, LocaleData> = {
  se: {
    path: 'se',
    isoLocale: IsoLocale.SvSe,
    marketLabel: MarketLabel.SE,
    apiMarket: ApiMarket.Sweden,
    htmlLang: 'sv',
    hrefLang: 'sv-se',
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
    currencyLocale: 'sv-SE',
  },
  'se-en': {
    path: 'se-en',
    isoLocale: IsoLocale.EnSe,
    marketLabel: MarketLabel.SE,
    apiMarket: ApiMarket.Sweden,
    htmlLang: 'en',
    hrefLang: 'en-se',
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
    currencyLocale: 'en-SE',
  },
  no: {
    path: 'no',
    isoLocale: IsoLocale.NbNo,
    marketLabel: MarketLabel.NO,
    apiMarket: ApiMarket.Norway,
    htmlLang: 'no',
    hrefLang: 'no-no',
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
    currencyLocale: 'nb-NO',
  },
  'no-en': {
    path: 'no-en',
    isoLocale: IsoLocale.EnNo,
    marketLabel: MarketLabel.NO,
    apiMarket: ApiMarket.Norway,
    htmlLang: 'en',
    hrefLang: 'en-no',
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
    currencyLocale: 'en-NO',
  },
  dk: {
    path: 'dk',
    isoLocale: IsoLocale.DaDk,
    marketLabel: MarketLabel.DK,
    apiMarket: ApiMarket.Denmark,
    htmlLang: 'da',
    hrefLang: 'da-dk',
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
    currencyLocale: 'da-DK',
  },
  'dk-en': {
    path: 'dk-en',
    isoLocale: IsoLocale.EnDk,
    marketLabel: MarketLabel.DK,
    apiMarket: ApiMarket.Denmark,
    htmlLang: 'en',
    hrefLang: 'en-dk',
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
    currencyLocale: 'en-DK',
  },
}
