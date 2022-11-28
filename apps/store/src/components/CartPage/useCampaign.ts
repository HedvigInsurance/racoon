import { useRedeemCampaignMutation, useUnredeemCampaignMutation } from '@/services/apollo/generated'

type Params = {
  cartId: string
}

export const useRedeemCampaign = ({ cartId }: Params) => {
  const [redeemCampaign, result] = useRedeemCampaignMutation()

  const redeem = async (code: string) => {
    await redeemCampaign({ variables: { cartId, code } })
  }

  const userErrors = result.data?.cartRedeemCampaign.userErrors
  const userError = userErrors?.[0]?.message

  return [redeem, { ...result, userError }] as const
}

export const useUnredeemCampaign = ({ cartId }: Params) => {
  const [unredeemCampaign, result] = useUnredeemCampaignMutation()

  const unredeem = async (campaignId: string) => {
    await unredeemCampaign({ variables: { cartId, campaignId } })
  }

  return [unredeem, result] as const
}
