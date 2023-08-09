import { useRouter } from 'next/router'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { UiLocale } from '@/utils/l10n/types'

export const useCurrentLocale = () => {
  const router = useRouter()
  return getLocaleOrFallback(router.locale as UiLocale)
}
