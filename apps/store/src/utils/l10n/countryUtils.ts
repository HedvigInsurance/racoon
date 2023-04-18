import { countries, CountryData } from '@/utils/l10n/countries'
import { locales } from '@/utils/l10n/locales'
import { toIsoLocale } from '@/utils/l10n/localeUtils'
import { CountryLabel, IsoLocale, Language, RoutingLocale } from '@/utils/l10n/types'

const localeCountries = Object.fromEntries(
  Object.entries(countries).flatMap(([countryId, countryData]) =>
    countryData.locales.map((locale) => [locale, countryId]),
  ),
) as Record<IsoLocale, CountryLabel>

export const getCountryByLocale = (locale: RoutingLocale): CountryData => {
  const countryData = countries[localeCountries[toIsoLocale(locale)]]
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!countryData) {
    throw new Error(`Failed to find country by locale=${locale}`)
  }
  return countryData
}

export const getCountryLocale = (country: CountryLabel, language: Language): IsoLocale => {
  const countryData = countries[country]
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!countryData) {
    throw new Error(`Failed to find country id=${country}`)
  }
  return (
    countryData.locales.find((locale) => locales[locale].language === language) ||
    countryData.defaultLocale
  )
}
