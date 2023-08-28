import { useRedeemCampaignMutation, useUnredeemCampaignMutation } from '@/services/apollo/generated'
import { useErrorMessage } from '@/utils/useErrorMessage'

type Params = {
  shopSessionId: string
  onCompleted?: () => void
}

export const useRedeemCampaign = ({ shopSessionId, onCompleted }: Params) => {
  const [redeemCampaign, result] = useRedeemCampaignMutation({
    onError: () => {}, // Handled via errorMessage
    // TODO: this is a workaround for getting shop session to propagate
    refetchQueries: 'active',
    awaitRefetchQueries: true,
    onCompleted,
  })
  const errorMessage = useErrorMessage(result.error)

  const redeem = async (code: string) => {
    await redeemCampaign({ variables: { shopSessionId, code } })
  }

  return [redeem, { ...result, errorMessage }] as const
}

export const useUnredeemCampaign = ({ shopSessionId }: Params) => {
  const [unredeemCampaign, result] = useUnredeemCampaignMutation({
    // TODO: this is a workaround for getting shop session to propagate
    refetchQueries: 'active',
    awaitRefetchQueries: true,
  })

  const unredeem = async (campaignId: string) => {
    await unredeemCampaign({ variables: { shopSessionId, campaignId } })
  }

  return [unredeem, result] as const
}
