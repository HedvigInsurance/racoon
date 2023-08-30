import { RoutingLocale } from '@/utils/l10n/types'

export type UserParams = {
  shopSessionId: string
  locale: RoutingLocale
  campaignCode?: string
}
