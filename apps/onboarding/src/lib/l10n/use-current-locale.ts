import { useRouter } from 'next/router'
import { LocaleLabel, locales } from './locales'

const FALLBACK_LOCALE: LocaleLabel = 'se-EN'

export const useCurrentLocale = () => {
  const router = useRouter()
  return locales[(router.locale || FALLBACK_LOCALE) as LocaleLabel]
}
