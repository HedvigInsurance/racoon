import { datadogLogs } from '@datadog/browser-logs'
import { useRouter } from 'next/router'
import { useShopSessionQuery } from '@/services/apollo/generated'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { QueryParam } from './retargeting.constants'

export const useRedirectUser = () => {
  const { routingLocale } = useCurrentLocale()
  const router = useRouter()

  const shopSessionId = useShopSessionId()
  useShopSessionQuery({
    skip: !shopSessionId,
    variables: shopSessionId ? { shopSessionId } : undefined,
    onCompleted(data) {
      if (data.shopSession.cart.entries.length > 0) {
        router.push(
          PageLink.session({
            shopSessionId: data.shopSession.id,
            next: PageLink.cart({ locale: routingLocale }),
          }),
        )
      }
    },
    onError(error) {
      datadogLogs.logger.warn('Retargeting | Failed to fetch shop session', {
        shopSessionId,
        error,
      })
      router.push(PageLink.store({ locale: routingLocale }))
    },
  })
}

const useShopSessionId = () => {
  const router = useRouter()
  const shopSessionId = router.query[QueryParam.ShopSession]
  return typeof shopSessionId === 'string' ? shopSessionId : undefined
}
