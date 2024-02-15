import { useParams } from 'next/navigation'
import { FALLBACK_LOCALE } from '@/utils/l10n/locales'
import { toRoutingLocale } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'

// Separate hook needed for app router because next/navigation is used instead of next/router
export const useAppRouterLocale = () => {
  const { locale } = useParams<{ locale: RoutingLocale }>() ?? {
    locale: toRoutingLocale(FALLBACK_LOCALE),
  }
  return locale
}
