import { isoLocale, locales } from '@/lib/l10n/locales'
import { CountryCode, Language, Locale, CountryLabel, UiLocale, IsoLocale } from './types'

export type CountryData = {
  id: CountryLabel
  adtractionScriptSrc?: string
  countryCode: CountryCode
  defaultLocale: IsoLocale
  locales: IsoLocale[]
}

export const countries: Record<CountryLabel, CountryData> = {
  [CountryLabel.SE]: {
    id: CountryLabel.SE,
    adtractionScriptSrc: 'https://cdn.adt387.com/jsTag?ap=1412531808',
    countryCode: CountryCode.Se,
    defaultLocale: Locale.SvSe,
    locales: [Locale.SvSe, Locale.EnSe],
  },
  [CountryLabel.NO]: {
    id: CountryLabel.NO,
    adtractionScriptSrc: 'https://cdn.adt387.com/jsTag?ap=1492109567',
    countryCode: CountryCode.No,
    defaultLocale: Locale.NbNo,
    locales: [Locale.NbNo, Locale.EnNo],
  },
  [CountryLabel.DK]: {
    id: CountryLabel.DK,
    adtractionScriptSrc: 'https://cdn.adt387.com/jsTag?ap=1589794294',
    countryCode: CountryCode.Dk,
    defaultLocale: Locale.DaDk,
    locales: [Locale.DaDk, Locale.EnDk],
  },
}

const localeCountries = Object.fromEntries(
  Object.entries(countries).flatMap(([countryId, countryData]) =>
    countryData.locales.map((locale) => [locale, countryId]),
  ),
) as Record<IsoLocale, CountryLabel>

export const getCountryByLocale = (locale: UiLocale): CountryData => {
  locale = isoLocale(locale)
  const countryData = countries[localeCountries[isoLocale(locale)]]
  if (!countryData) {
    throw new Error(`Failed to find country by locale=${locale}`)
  }
  return countryData
}

export const getCountryLocale = (country: CountryLabel, language: Language): IsoLocale => {
  const countryData = countries[country as CountryLabel]
  if (!countryData) {
    throw new Error(`Failed to find country id=${country}`)
  }
  return (
    countryData.locales.find((locale) => locales[locale].language === language) ||
    countryData.defaultLocale
  )
}
