import { CountryCode, CountryLabel, type IsoLocale, Locale } from './types'

export type CountryData = {
  id: CountryLabel
  adtractionScriptSrc?: string
  countryCode: CountryCode
  defaultLocale: IsoLocale
  locales: Array<IsoLocale>
  currencyCode: string
}

export const countries: Record<CountryLabel, CountryData> = {
  [CountryLabel.SE]: {
    id: CountryLabel.SE,
    adtractionScriptSrc: 'https://cdn.adt387.com/jsTag?ap=1412531808',
    countryCode: CountryCode.Se,
    defaultLocale: Locale.SvSe,
    locales: [Locale.SvSe, Locale.EnSe],
    currencyCode: 'SEK',
  },
  [CountryLabel.NO]: {
    id: CountryLabel.NO,
    adtractionScriptSrc: 'https://cdn.adt387.com/jsTag?ap=1492109567',
    countryCode: CountryCode.No,
    defaultLocale: Locale.NoNo,
    locales: [Locale.NoNo, Locale.EnNo],
    currencyCode: 'NOK',
  },
  [CountryLabel.DK]: {
    id: CountryLabel.DK,
    adtractionScriptSrc: 'https://cdn.adt387.com/jsTag?ap=1589794294',
    countryCode: CountryCode.Dk,
    defaultLocale: Locale.DaDk,
    locales: [Locale.DaDk, Locale.EnDk],
    currencyCode: 'DKK',
  },
}
