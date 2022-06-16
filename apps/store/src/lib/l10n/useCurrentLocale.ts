import { useRouter } from 'next/router'
import { FALLBACK_LOCALE, locales } from './locales'
import { Locale } from './types'

export const useCurrentLocale = () => {
  const router = useRouter()

  const locale = router.locale === 'default' ? FALLBACK_LOCALE : router.locale || FALLBACK_LOCALE

  return locales[locale as Locale]
}
