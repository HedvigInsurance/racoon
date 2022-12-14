import { useRedeemCampaignMutation, useUnredeemCampaignMutation } from '@/services/apollo/generated'
import { getMutationError } from '@/utils/getMutationError'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

type Params = {
  cartId: string
}

export const useRedeemCampaign = ({ cartId }: Params) => {
  const [redeemCampaign, result] = useRedeemCampaignMutation()
  const { locale } = useCurrentLocale()

  const redeem = async (code: string) => {
    await redeemCampaign({ variables: { cartId, code, locale } })
  }

  const userError = getMutationError(result, result.data?.cartRedeemCampaign)
  return [redeem, { ...result, userError }] as const
}

export const useUnredeemCampaign = ({ cartId }: Params) => {
  const [unredeemCampaign, result] = useUnredeemCampaignMutation()
  const { locale } = useCurrentLocale()

  const unredeem = async (campaignId: string) => {
    await unredeemCampaign({ variables: { cartId, campaignId, locale } })
  }

  return [unredeem, result] as const
}
