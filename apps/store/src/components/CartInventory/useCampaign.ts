import { useRedeemCampaignMutation, useUnredeemCampaignMutation } from '@/services/apollo/generated'
import { useErrorMessage } from '@/utils/useErrorMessage'

type Params = {
  cartId: string
}

export const useRedeemCampaign = ({ cartId }: Params) => {
  const [redeemCampaign, result] = useRedeemCampaignMutation({
    onError: () => {}, // Handled via errorMessage
  })
  const errorMessage = useErrorMessage(result.error)

  const redeem = async (code: string) => {
    await redeemCampaign({ variables: { cartId, code } })
  }

  return [redeem, { ...result, errorMessage }] as const
}

export const useUnredeemCampaign = ({ cartId }: Params) => {
  const [unredeemCampaign, result] = useUnredeemCampaignMutation()

  const unredeem = async (campaignId: string) => {
    await unredeemCampaign({ variables: { cartId, campaignId } })
  }

  return [unredeem, result] as const
}
