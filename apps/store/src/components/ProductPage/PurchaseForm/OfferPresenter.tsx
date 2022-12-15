import styled from '@emotion/styled'
import { RefObject, useState } from 'react'
import { Button, Space } from 'ui'
import { useUpdateCancellation } from '@/components/ProductPage/PurchaseForm/useUpdateCancellation'
import { useUpdateStartDate } from '@/components/ProductPage/PurchaseForm/useUpdateStartDate'
import { ScrollPast } from '@/components/ProductPage/ScrollPast/ScrollPast'
import { ScrollToButton } from '@/components/ProductPage/ScrollToButton/ScrollToButton'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Text } from '@/components/Text/Text'
import { TierSelector } from '@/components/TierSelector/TierSelector'
import {
  ExternalInsuranceCancellationOption,
  ProductOfferFragment,
} from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { convertToDate } from '@/utils/date'
import { useFormatter } from '@/utils/useFormatter'
import { CancellationForm, CancellationOption } from './CancellationForm/CancellationForm'
import { useHandleSubmitAddToCart } from './useHandleSubmitAddToCart'

type Props = {
  priceIntent: PriceIntent
  shopSession: ShopSession
  scrollPastRef: RefObject<HTMLElement>
  // TODO: Use better type
  onAddedToCart: (productOffer: ProductOfferFragment) => void
}

export const OfferPresenter = ({
  priceIntent,
  shopSession,
  scrollPastRef,
  onAddedToCart,
}: Props) => {
  const formatter = useFormatter()
  const [selectedOfferId, setSelectedOfferId] = useState(priceIntent.offers[0].id)
  const selectedOffer = priceIntent.offers.find((offer) => offer.id === selectedOfferId)!

  const [updateStartDate, updateStartDateInfo] = useUpdateStartDate({
    priceIntentId: priceIntent.id,
  })

  const handleStartDateChange = (startDate: Date) => {
    updateStartDate({ dateValue: startDate })
  }

  const [handleSubmitAddToCart, loadingAddToCart] = useHandleSubmitAddToCart({
    cartId: shopSession.cart.id,
    priceIntentId: priceIntent.id,
    onSuccess(productOfferId) {
      const addedProductOffer = priceIntent.offers.find((offer) => offer.id === productOfferId)

      if (addedProductOffer === undefined) {
        throw new Error(`Unknown offer added to cart: ${productOfferId}`)
      }

      onAddedToCart(addedProductOffer)
    },
  })

  const [handleUpdateCancellation, updateCancellationInfo] = useUpdateCancellation({
    priceIntentId: priceIntent.id,
  })

  const displayPrice = formatter.monthlyPrice(selectedOffer.price)

  const cancellationOption = getCancellationOption(priceIntent)

  const loading = loadingAddToCart || updateCancellationInfo.loading || updateStartDateInfo.loading

  return (
    <>
      <form onSubmit={handleSubmitAddToCart}>
        <Text as="p" align="center" size="xxl">
          {displayPrice}
        </Text>

        <Space y={0.25}>
          <TierSelector
            offers={priceIntent.offers}
            selectedOfferId={selectedOfferId}
            onValueChange={setSelectedOfferId}
            currencyCode={shopSession.currencyCode}
          />
          <CancellationForm
            option={cancellationOption}
            startDate={convertToDate(priceIntent.startDate)!}
            onAutoSwitchChange={handleUpdateCancellation}
            onStartDateChange={handleStartDateChange}
          />

          <CancellationForm
            option={cancellationOption}
            startDate={convertToDate(priceIntent.startDate)!}
            onAutoSwitchChange={handleUpdateCancellation}
            onStartDateChange={handleStartDateChange}
          />

          <SubmitButton loading={loading} />
        </Space>
      </form>
      <ScrollPast targetRef={scrollPastRef}>
        <ScrollToButton targetRef={scrollPastRef} type="button">
          <span>{displayPrice}</span>
          <Separator />
          <span>Add to cart</span>
        </ScrollToButton>
      </ScrollPast>
    </>
  )
}

// TODO: Localize
const SubmitButton = ({ loading }: { loading: boolean }) => {
  return (
    <SpaceFlex space={0.5} direction="vertical" align="center">
      <Button fullWidth disabled={loading}>
        {loading ? 'Loading...' : 'Add to cart'}
      </Button>
      <Text size="s" align="center">
        Cancel anytime
      </Text>
    </SpaceFlex>
  )
}

const Separator = styled.div(({ theme }) => ({
  width: 1,
  backgroundColor: theme.colors.gray600,
  margin: `0 ${theme.space[3]}`,
  alignSelf: 'stretch',
}))

const getCancellationOption = (priceIntent: PriceIntent): CancellationOption => {
  const { cancellation, externalInsurer } = priceIntent
  if (cancellation.option === ExternalInsuranceCancellationOption.Iex) {
    return {
      type: 'IEX',
      companyName: externalInsurer?.displayName ?? 'Unknown',
      requested: cancellation.requested,
    }
  } else {
    return { type: 'NONE' }
  }
}
