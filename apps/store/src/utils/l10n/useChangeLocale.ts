import { useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import { ISbStoryData } from '@storyblok/react'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { CookiePersister } from '@/services/persister/CookiePersister'
import { setupShopSessionServiceClientSide } from '@/services/shopSession/ShopSession.helpers'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { LOCALE_COOKIE_KEY, LOCALE_COOKIE_MAX_AGE } from '@/utils/l10n/locales'
import { toRoutingLocale } from '@/utils/l10n/localeUtils'
import { IsoLocale } from '@/utils/l10n/types'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'

export const useChangeLocale = (currentPageStory: ISbStoryData) => {
  const router = useRouter()
  const currentCountry = useCurrentCountry()
  const apolloClient = useApolloClient()
  return useCallback(
    (newLocale: IsoLocale) => {
      try {
        const routingLocale = toRoutingLocale(newLocale)

        const cookiePersister = new CookiePersister(LOCALE_COOKIE_KEY)
        cookiePersister.save(routingLocale, undefined, { maxAge: LOCALE_COOKIE_MAX_AGE })

        const newCountry = getCountryByLocale(routingLocale)
        if (newCountry !== currentCountry) {
          // Country change should be full app reload to maintain our programming assumptions
          // We may clean any previous shop session while we're at it
          setupShopSessionServiceClientSide(apolloClient).reset()
          window.location.href = `/${routingLocale}`
          return
        }
        const targetAlternate = currentPageStory.alternates.find((alternate) =>
          alternate.full_slug.startsWith(routingLocale),
        )
        if (targetAlternate) {
          router.push(targetAlternate.full_slug, undefined, { locale: routingLocale })
        } else {
          // Base case, failed to find alternate in new language
          router.push('/', undefined, { locale: routingLocale })
        }
      } catch (error) {
        datadogLogs.logger.error('Failed to change locale', { error, newLocale })
        router.reload()
      }
    },
    [apolloClient, currentCountry, currentPageStory, router],
  )
}
