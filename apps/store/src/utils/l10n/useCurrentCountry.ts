import { useRouter } from 'next/router'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'

export const useCurrentCountry = () => {
  const router = useRouter()
  return getCountryByLocale(getLocaleOrFallback(router.locale).routingLocale)
}
