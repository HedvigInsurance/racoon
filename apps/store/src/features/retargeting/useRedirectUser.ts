import { datadogLogs } from '@datadog/browser-logs'
import { useRouter } from 'next/router'
import {
  type ShopSessionRetargetingQuery,
  useShopSessionRetargetingQuery,
} from '@/services/apollo/generated'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { type RedirectUserParams } from './retargeting.types'

export const useRedirectUser = (params: RedirectUserParams) => {
  const { routingLocale } = useCurrentLocale()
  const router = useRouter()

  useShopSessionRetargetingQuery({
    variables: { shopSessionId: params.shopSessionId },
    onCompleted(data) {
      if (hasAddedCartEntries(data)) {
        router.push(
          PageLink.session({
            shopSessionId: data.shopSession.id,
            next: PageLink.cart({ locale: routingLocale }),
            code: params.campaignCode,
          }),
        )
        return
      }

      const priceIntentId = getSingleProduct(data)
      if (priceIntentId) {
        router.push(
          PageLink.session({
            shopSessionId: data.shopSession.id,
            code: params.campaignCode,
            priceIntentId,
          }),
        )
        return
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

const hasAddedCartEntries = (data: ShopSessionRetargetingQuery): boolean => {
  return data.shopSession.cart.entries.length > 0
}

const getSingleProduct = (data: ShopSessionRetargetingQuery): string | null => {
  const productNames = data.shopSession.priceIntents.map((priceIntent) => priceIntent.product.name)
  const products = new Set(productNames)
  if (products.size !== 1) return null

  // Assume that the last price intent is the latest one
  const priceIntent = data.shopSession.priceIntents[data.shopSession.priceIntents.length - 1]
  return priceIntent.id
}
