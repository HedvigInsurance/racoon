import { LocaleLabel, locales } from './locales'

import { useRouter } from 'next/router'

const FALLBACK_LOCALE: LocaleLabel = 'se-EN'

export const useCurrentLocale = () => {
  const router = useRouter()

  const locale = router.locale === 'default' ? FALLBACK_LOCALE : router.locale || FALLBACK_LOCALE

  return locales[locale as LocaleLabel]
}
