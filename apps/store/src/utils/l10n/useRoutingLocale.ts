import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

export const useRoutingLocale = () => {
  return useCurrentLocale().routingLocale
}
