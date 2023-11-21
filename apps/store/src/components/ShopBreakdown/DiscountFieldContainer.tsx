import { datadogLogs } from '@datadog/browser-logs'
import { ComponentProps } from 'react'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useRedeemCampaign, useUnredeemCampaign } from '@/utils/useCampaign'
import { useGetDiscountExplanation } from '@/utils/useDiscountExplanation'
import { Discount } from './Discount'
import { DiscountField } from './DiscountField'

type Props = {
  shopSession: ShopSession
}

type DiscountFieldProps = ComponentProps<typeof DiscountField>

export const DiscountFieldContainer = (props: Props) => {
  const [redeemCampaign, { loading: loadingRedeem, errorMessage }] = useRedeemCampaign({
    shopSessionId: props.shopSession.id,
  })
  const handleAdd: DiscountFieldProps['onAdd'] = (campaignCode) => {
    redeemCampaign(campaignCode)
  }

  const [unredeemCampaign, { loading: loadingUnredeem }] = useUnredeemCampaign({
    shopSessionId: props.shopSession.id,
  })
  const handleRemove = () => {
    const campaignId = props.shopSession.cart.redeemedCampaign?.id
    if (!campaignId) {
      datadogLogs.logger.warn('Tried to unredeem campaign without id')
      return
    }
    unredeemCampaign(campaignId)
  }

  const redeemedCampaign = props.shopSession.cart.redeemedCampaign
  const hasCampaign = !!redeemedCampaign

  const getDiscountExplanation = useGetDiscountExplanation()
  const campaign = hasCampaign
    ? {
        code: redeemedCampaign.code,
        explanation: getDiscountExplanation(redeemedCampaign.discount),
      }
    : undefined

  if (!props.shopSession.cart.campaignsEnabled) {
    return campaign ? <Discount {...campaign} /> : null
  }

  return (
    <DiscountField
      defaultActive={hasCampaign}
      campaign={campaign}
      onAdd={handleAdd}
      loadingAdd={loadingRedeem}
      onRemove={handleRemove}
      loadingRemove={loadingUnredeem}
      errorMessage={errorMessage}
    />
  )
}
