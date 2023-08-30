import { datadogLogs } from '@datadog/browser-logs'
import { useRouter } from 'next/router'
import { useShopSessionQuery } from '@/services/apollo/generated'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { QueryParam } from './retargeting.constants'

export const useRedirectUser = () => {
  const { routingLocale } = useCurrentLocale()
  const router = useRouter()

  const queryParams = useQueryParams()
  useShopSessionQuery({
    skip: !queryParams,
    variables: queryParams ? { shopSessionId: queryParams.shopSessionId } : undefined,
    onCompleted(data) {
      if (data.shopSession.cart.entries.length > 0) {
        router.push(
          PageLink.session({
            shopSessionId: data.shopSession.id,
            next: PageLink.cart({ locale: routingLocale }),
            code: queryParams?.campaignCode,
          }),
        )
      }
    },
    onError(error) {
      datadogLogs.logger.warn('Retargeting | Failed to fetch shop session', {
        shopSessionId: queryParams?.shopSessionId,
        error,
      })
      router.push(PageLink.store({ locale: routingLocale }))
    },
  })
}

type QueryParamData = {
  shopSessionId: string
  campaignCode?: string
}

const useQueryParams = (): QueryParamData | null => {
  const router = useRouter()
  const shopSessionId = router.query[QueryParam.ShopSession]

  if (typeof shopSessionId !== 'string') return null

  const campaignCode = router.query[QueryParam.CampaignCode]
  return {
    shopSessionId,
    ...(typeof campaignCode === 'string' && { campaignCode }),
  }
}
