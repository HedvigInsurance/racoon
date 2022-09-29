import { useRouter } from 'next/router'
import { getCountryByLocale } from './countries'
import { getLocaleOrFallback } from './locales'

export const useCurrentCountry = () => {
  const router = useRouter()
  return getCountryByLocale(getLocaleOrFallback(router.locale).locale)
}
