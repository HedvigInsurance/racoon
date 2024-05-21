import { datadogLogs } from '@datadog/browser-logs'
import { type ComponentProps } from 'react'
import { hasBundleDiscount } from '@/features/bundleDiscount/bundleDiscount'
import { BundleDiscountCartSummary } from '@/features/bundleDiscount/BundleDiscountCartSummary'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useRedeemCampaign, useUnredeemCampaign } from '@/utils/useCampaign'
import { Discount } from './Discount'
import { DiscountField } from './DiscountField'
import { useDiscountProps } from './useDiscountExplanation'

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

  const discount = useDiscountProps(redeemedCampaign)

  if (hasBundleDiscount(props.shopSession) && redeemedCampaign) {
    return <BundleDiscountCartSummary cart={props.shopSession.cart} />
  } else if (!props.shopSession.cart.campaignsEnabled) {
    return discount ? <Discount {...discount} /> : null
  }

  return (
    <DiscountField
      defaultActive={hasCampaign}
      discount={discount}
      onAdd={handleAdd}
      loadingAdd={loadingRedeem}
      onRemove={handleRemove}
      loadingRemove={loadingUnredeem}
      errorMessage={errorMessage}
    />
  )
}
