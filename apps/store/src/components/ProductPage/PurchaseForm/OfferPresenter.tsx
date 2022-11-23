import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { RefObject, useState } from 'react'
import { Button, InputField } from 'ui'
import { FormElement } from '@/components/ProductPage/ProductPage.constants'
import { ScrollPast } from '@/components/ProductPage/ScrollPast/ScrollPast'
import { ScrollToButton } from '@/components/ProductPage/ScrollToButton/ScrollToButton'
import { useHandleSubmitAddToCart } from '@/components/ProductPage/useHandleSubmitAddToCart'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Text } from '@/components/Text/Text'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { formatAPIDate } from '@/utils/date'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import { TierSelector } from './TierSelector'

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
    onSuccess(productOfferId) {
      const addedProdutOffer = priceIntent.offers.find((offer) => offer.id === productOfferId)

      if (addedProdutOffer === undefined) {
        throw new Error(`Unknown offer added to cart: ${productOfferId}`)
      }

      onAddedToCart(addedProdutOffer)
    },
  })

  const displayPrice = t('MONTHLY_PRICE', {
    displayAmount: formatter.format(selectedOffer.price.amount),
  })

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

          <CancellationSettings />

          <SubmitButton loading={loadingAddToCart} />
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

// TODO: Support IEX switching
const CancellationSettings = () => {
  return (
    <InputField
      label="Start date"
      type="date"
      name={FormElement.StartDate}
      defaultValue={formatAPIDate(new Date())}
    />
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
