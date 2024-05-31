import { useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { CookiePersister } from '@/services/persister/CookiePersister'
import { SHOP_SESSION_COOKIE_MAX_AGE } from '@/services/shopSession/ShopSession.constants'
import { setupShopSessionServiceClientSide } from '@/services/shopSession/ShopSession.helpers'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { LOCALE_COOKIE_KEY, LOCALE_COOKIE_MAX_AGE } from '@/utils/l10n/locales'
import { toRoutingLocale } from '@/utils/l10n/localeUtils'
import type { IsoLocale } from '@/utils/l10n/types'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'

export const useChangeLocale = () => {
  const router = useRouter()
  const currentCountry = useCurrentCountry()
  const apolloClient = useApolloClient()
  return useCallback(
    (newLocale: IsoLocale) => {
      try {
        const routingLocale = toRoutingLocale(newLocale)

        const cookiePersister = new CookiePersister(LOCALE_COOKIE_KEY, SHOP_SESSION_COOKIE_MAX_AGE)
        cookiePersister.save(routingLocale, undefined, { maxAge: LOCALE_COOKIE_MAX_AGE })

        // TODO: this doesn't handle changing country + cross domain
        const newCountry = getCountryByLocale(routingLocale)
        if (newCountry !== currentCountry) {
          // Country change should be full app reload to maintain our programming assumptions
          // We may clean any previous shop session while we're at it
          setupShopSessionServiceClientSide(apolloClient).reset()
          window.location.href = `/${routingLocale}`
          return
        }

        const targetAlternate = document.querySelector<HTMLLinkElement>(
          `link[rel=alternate][hreflang=${newLocale}]`,
        )
        const newPathname =
          targetAlternate != null ? new URL(targetAlternate.href).pathname : `/${routingLocale}`
        window.location.pathname = newPathname
      } catch (error) {
        datadogLogs.logger.error('Failed to change locale', { error, newLocale })
        router.refresh()
      }
    },
    [apolloClient, currentCountry, router],
  )
}
