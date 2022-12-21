import { useRedeemCampaignMutation, useUnredeemCampaignMutation } from '@/services/apollo/generated'
import { useGetMutationError } from '@/utils/useGetMutationError'

type Params = {
  cartId: string
}

export const useRedeemCampaign = ({ cartId }: Params) => {
  const getMutationError = useGetMutationError()
  const [redeemCampaign, result] = useRedeemCampaignMutation()

  const redeem = async (code: string) => {
    await redeemCampaign({ variables: { cartId, code } })
  }

  const userError = getMutationError(result, result.data?.cartRedeemCampaign)
  return [redeem, { ...result, userError }] as const
}

export const useUnredeemCampaign = ({ cartId }: Params) => {
  const [unredeemCampaign, result] = useUnredeemCampaignMutation()

  const unredeem = async (campaignId: string) => {
    await unredeemCampaign({ variables: { cartId, campaignId } })
  }

  return [unredeem, result] as const
}
