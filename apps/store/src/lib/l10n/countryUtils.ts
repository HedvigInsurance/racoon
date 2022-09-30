import { countries, CountryData } from '@/lib/l10n/countries'
import { locales } from '@/lib/l10n/locales'
import { toIsoLocale } from '@/lib/l10n/localeUtils'
import { CountryLabel, IsoLocale, Language, UiLocale } from '@/lib/l10n/types'

const localeCountries = Object.fromEntries(
  Object.entries(countries).flatMap(([countryId, countryData]) =>
    countryData.locales.map((locale) => [locale, countryId]),
  ),
) as Record<IsoLocale, CountryLabel>

export const getCountryByLocale = (locale: UiLocale): CountryData => {
  locale = toIsoLocale(locale)
  const countryData = countries[localeCountries[toIsoLocale(locale)]]
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
