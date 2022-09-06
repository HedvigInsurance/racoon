import { useRouter } from 'next/router'
import { getCountryByLocale } from './countries'
import { FALLBACK_LOCALE } from './locales'

export const useCurrentCountry = () => {
  const router = useRouter()
  const locale = router.locale === 'default' ? FALLBACK_LOCALE : router.locale || FALLBACK_LOCALE
  return getCountryByLocale(locale)
}
