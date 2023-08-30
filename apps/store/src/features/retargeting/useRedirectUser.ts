import { datadogLogs } from '@datadog/browser-logs'
import { useRouter } from 'next/router'
import { useShopSessionQuery } from '@/services/apollo/generated'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { type RedirectUserParams } from './retargeting.types'

export const useRedirectUser = (params: RedirectUserParams) => {
  const { routingLocale } = useCurrentLocale()
  const router = useRouter()

  useShopSessionQuery({
    variables: { shopSessionId: params.shopSessionId },
    onCompleted(data) {
      if (data.shopSession.cart.entries.length > 0) {
        router.push(
          PageLink.session({
            shopSessionId: data.shopSession.id,
            next: PageLink.cart({ locale: routingLocale }),
            code: params.campaignCode,
          }),
        )
      }
    },
    onError(error) {
      datadogLogs.logger.warn('Retargeting | Failed to fetch shop session', {
        shopSessionId: params.shopSessionId,
        error,
      })
      router.push(PageLink.store({ locale: routingLocale }))
    },
  })
}
