import { useRouter } from 'next/router'
import { getCountryByLocale } from '@/lib/l10n/countryUtils'
import { getLocaleOrFallback } from '@/lib/l10n/localeUtils'

export const useCurrentCountry = () => {
  const router = useRouter()
  return getCountryByLocale(getLocaleOrFallback(router.locale).routingLocale)
}
