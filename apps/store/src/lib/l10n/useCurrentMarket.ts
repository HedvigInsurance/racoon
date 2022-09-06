import { useRouter } from 'next/router'
import { FALLBACK_LOCALE } from './locales'
import { getMarketByLocale } from './markets'

export const useCurrentMarket = () => {
  const router = useRouter()
  const locale = router.locale === 'default' ? FALLBACK_LOCALE : router.locale || FALLBACK_LOCALE
  return getMarketByLocale(locale)
}
