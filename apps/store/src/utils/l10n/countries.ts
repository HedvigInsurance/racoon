import { CurrencyCode } from '@/services/apollo/generated'
import { CountryCode, CountryLabel, IsoLocale, Locale } from './types'

export type CountryData = {
  id: CountryLabel
  adtractionScriptSrc?: string
  countryCode: CountryCode
  currencyCode: CurrencyCode
  defaultLocale: IsoLocale
  locales: IsoLocale[]
}

export const countries: Record<CountryLabel, CountryData> = {
  [CountryLabel.SE]: {
    id: CountryLabel.SE,
    adtractionScriptSrc: 'https://cdn.adt387.com/jsTag?ap=1412531808',
    countryCode: CountryCode.Se,
    currencyCode: CurrencyCode.Sek,
    defaultLocale: Locale.SvSe,
    locales: [Locale.SvSe, Locale.EnSe],
  },
  [CountryLabel.NO]: {
    id: CountryLabel.NO,
    adtractionScriptSrc: 'https://cdn.adt387.com/jsTag?ap=1492109567',
    countryCode: CountryCode.No,
    currencyCode: CurrencyCode.Nok,
    defaultLocale: Locale.NbNo,
    locales: [Locale.NbNo, Locale.EnNo],
  },
  [CountryLabel.DK]: {
    id: CountryLabel.DK,
    adtractionScriptSrc: 'https://cdn.adt387.com/jsTag?ap=1589794294',
    countryCode: CountryCode.Dk,
    currencyCode: CurrencyCode.Dkk,
    defaultLocale: Locale.DaDk,
    locales: [Locale.DaDk, Locale.EnDk],
  },
}
