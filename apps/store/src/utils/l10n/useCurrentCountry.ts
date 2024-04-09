import type { CountryData } from '@/utils/l10n/countries'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'

export const useCurrentCountry = (): CountryData => {
  return getCountryByLocale(useRoutingLocale())
}
