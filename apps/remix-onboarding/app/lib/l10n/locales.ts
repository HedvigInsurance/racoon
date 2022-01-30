import { Market as ApiMarket, Locale } from '~/lib/types'
import { PhoneNumberData, phoneNumbers } from './phone-numbers'
import { birthDateFormats, ssnFormats, ssnLengths } from './birth-date-and-ssn-formats'

export type LocaleData = {
  pathLocale: Locale
  marketLabel: MarketLabel
  apiMarket: ApiMarket
  htmlLang: 'en' | 'sv' | 'no' | 'da'
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
}

export type MarketLabel = 'SE' | 'NO' | 'DK'

export const locales: Record<Locale, LocaleData> = {
  se: {
    pathLocale: 'se',
    marketLabel: 'SE',
    apiMarket: 'SWEDEN',
    htmlLang: 'sv',
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
  },
  'se-en': {
    pathLocale: 'se-en',
    marketLabel: 'SE',
    apiMarket: 'SWEDEN',
    htmlLang: 'en',
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
  },
  no: {
    pathLocale: 'no',
    marketLabel: 'NO',
    apiMarket: 'NORWAY',
    htmlLang: 'no',
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
  },
  'no-en': {
    pathLocale: 'no',
    marketLabel: 'NO',
    apiMarket: 'NORWAY',
    htmlLang: 'en',
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
  },
  dk: {
    pathLocale: 'dk',
    marketLabel: 'DK',
    apiMarket: 'DENMARK',
    htmlLang: 'da',
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
  },
  'dk-en': {
    pathLocale: 'dk-en',
    marketLabel: 'DK',
    apiMarket: 'DENMARK',
    htmlLang: 'en',
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
  },
}
