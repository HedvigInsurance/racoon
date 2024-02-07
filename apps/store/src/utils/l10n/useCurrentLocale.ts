import { useRouter } from 'next/router'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'

export const useCurrentLocale = () => {
  const router = useRouter()
  return getLocaleOrFallback(router.query.locale as RoutingLocale)
}
