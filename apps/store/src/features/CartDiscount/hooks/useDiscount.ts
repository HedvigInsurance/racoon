import { datadogLogs } from '@datadog/browser-logs'
import { type ShopSession } from '@/services/shopSession/ShopSession.types'
import { useRedeemCampaign, useUnredeemCampaign } from '@/utils/useCampaign'
import { useGetCampaignCodeExplanation } from './useGetCodeExplanation'

export const useDiscount = (shopSession: ShopSession) => {
  const [redeemCampaign, { loading: loadingRedeem, errorMessage }] = useRedeemCampaign({
    shopSessionId: shopSession.id,
  })

  const [unredeemCampaign, { loading: loadingUnredeem }] = useUnredeemCampaign({
    shopSessionId: shopSession.id,
  })

  const getCodeExplanation = useGetCampaignCodeExplanation()

  const unredeem = () => {
    const campaignId = shopSession.cart.redeemedCampaign?.id

    if (!campaignId) {
      datadogLogs.logger.warn('Tried to unredeem campaign without id')
      return
    }

    unredeemCampaign(campaignId)
  }

  const campaign = shopSession.cart.redeemedCampaign
  const campaignCode = campaign?.code
  const codeExplanation = getCodeExplanation(campaign?.discount)
  const isLoading = loadingRedeem || loadingUnredeem

  return {
    campaignCode,
    codeExplanation,
    isLoading,
    errorMessage,
    redeemCampaign,
    unredeemCampaign: unredeem,
  }
}
