import { useRouter } from 'next/router'
import { getLocaleOrFallback } from './locales'

export const useCurrentLocale = () => {
  const router = useRouter()
  return getLocaleOrFallback(router.locale)
}
