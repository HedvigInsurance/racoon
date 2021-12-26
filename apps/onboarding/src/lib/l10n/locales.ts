import { Locale as IsoLocale, Market as ApiMarket } from '@/lib/types'
import { ssnLengths, ssnFormats, birthDateFormats } from './birth-date-and-ssn-formats'
import { PhoneNumberData, phoneNumbers } from './phone-numbers'

export const LOCALE_URL_PARAMS = ['se', 'se-EN', 'no', 'no-EN', 'dk', 'dk-EN'] as const
export type LocaleUrlParams = typeof LOCALE_URL_PARAMS
export type LocaleLabel = LocaleUrlParams[number]

export type LocaleData = {
  path: LocaleLabel
  isoLocale: IsoLocale
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

export const locales: Record<LocaleLabel, LocaleData> = {
  se: {
    path: 'se',
    isoLocale: IsoLocale.SvSe,
    marketLabel: 'SE',
    apiMarket: ApiMarket.Sweden,
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
  'se-EN': {
    path: 'se-EN',
    isoLocale: IsoLocale.EnSe,
    marketLabel: 'SE',
    apiMarket: ApiMarket.Sweden,
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
    path: 'no',
    isoLocale: IsoLocale.NbNo,
    marketLabel: 'NO',
    apiMarket: ApiMarket.Norway,
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
  'no-EN': {
    path: 'no-EN',
    isoLocale: IsoLocale.EnNo,
    marketLabel: 'NO',
    apiMarket: ApiMarket.Norway,
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
    path: 'dk',
    isoLocale: IsoLocale.DaDk,
    marketLabel: 'DK',
    apiMarket: ApiMarket.Denmark,
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
  'dk-EN': {
    path: 'dk-EN',
    isoLocale: IsoLocale.EnDk,
    marketLabel: 'DK',
    apiMarket: ApiMarket.Denmark,
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
