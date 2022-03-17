import { useRouter } from 'next/router'
import { LocaleLabel, locales } from './locales'


const FALLBACK_LOCALE: LocaleLabel = 'se-en'

export const useCurrentLocale = () => {
  const router = useRouter()

  const locale = router.locale === 'default' ? FALLBACK_LOCALE : router.locale || FALLBACK_LOCALE

  return locales[locale as LocaleLabel]
}
