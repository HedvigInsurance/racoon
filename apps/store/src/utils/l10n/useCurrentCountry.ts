import { useRouter } from 'next/router'
import { CountryData } from '@/utils/l10n/countries'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { type RoutingLocale } from './types'

export const useCurrentCountry = (): CountryData => {
  const router = useRouter()
  return getCountryByLocale(getLocaleOrFallback(router.query.locale as RoutingLocale).routingLocale)
}
