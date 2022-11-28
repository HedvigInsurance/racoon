import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { RefObject, useState } from 'react'
import { Button } from 'ui'
import { useUpdateCancellation } from '@/components/ProductPage/PurchaseForm/useUpdateCancellation'
import { ScrollPast } from '@/components/ProductPage/ScrollPast/ScrollPast'
import { ScrollToButton } from '@/components/ProductPage/ScrollToButton/ScrollToButton'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Text } from '@/components/Text/Text'
import {
  ExternalInsuranceCancellationOption,
  ProductOfferFragment,
} from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import { CancellationForm, CancellationOption } from './CancellationForm/CancellationForm'
import { TierSelector } from './TierSelector'
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
  const { t } = useTranslation()
  const formatter = useCurrencyFormatter(shopSession.currencyCode)
  const [selectedOfferId, setSelectedOfferId] = useState(priceIntent.offers[0].id)
  const selectedOffer = priceIntent.offers.find((offer) => offer.id === selectedOfferId)!

  // TODO: Update start date on change
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

  const displayPrice = t('MONTHLY_PRICE', {
    displayAmount: formatter.format(selectedOffer.price.amount),
  })

  const cancellationOption = getCancellationOption(priceIntent.cancellation)

  const loading = loadingAddToCart || updateCancellationInfo.loading

  return (
    <>
      <form onSubmit={handleSubmitAddToCart}>
        <FormContent direction="vertical" align="center">
          <Text as="p" align="center" size="l">
            {displayPrice}
          </Text>

          <TierSelector
            offers={priceIntent.offers}
            selectedOfferId={selectedOfferId}
            onValueChange={setSelectedOfferId}
          />

          <CancellationForm
            option={cancellationOption}
            onAutoSwithChange={handleUpdateCancellation}
          />

          <SubmitButton loading={loading} />
        </FormContent>
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

const FormContent = styled(SpaceFlex)({
  flex: 1,
})

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

const getCancellationOption = (cancellation: PriceIntent['cancellation']): CancellationOption => {
  if (cancellation.option === ExternalInsuranceCancellationOption.Iex) {
    return { type: 'IEX', companyName: cancellation.externalInsurer?.displayName ?? 'Unknown' }
  } else {
    return { type: 'NONE' }
  }
}
