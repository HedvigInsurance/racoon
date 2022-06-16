import { useRouter } from 'next/router'
import { locales } from './locales'
import { Locale } from './types'

const FALLBACK_LOCALE: Locale = Locale.EnSe

export const useCurrentLocale = () => {
  const router = useRouter()

  const locale = router.locale === 'default' ? FALLBACK_LOCALE : router.locale || FALLBACK_LOCALE

  return locales[locale as Locale]
}
