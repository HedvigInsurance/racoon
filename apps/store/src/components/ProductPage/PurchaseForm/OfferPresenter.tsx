import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useMemo, useRef, useState } from 'react'
import { Button, InputField } from 'ui'
import { CartToast, CartToastAttributes } from '@/components/CartNotification/CartToast'
import { FormElement } from '@/components/ProductPage/ProductPage.constants'
import { useHandleSubmitAddToCart } from '@/components/ProductPage/useHandleSubmitAddToCart'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Text } from '@/components/Text/Text'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { ProductStory } from '@/services/storyblok/storyblok'
import { formatAPIDate } from '@/utils/date'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import { TierSelector } from './TierSelector'

const PLACEHOLDER_GRADIENT = ['#C0E4F3', '#99AAD8'] as const

type Props = {
  priceIntent: PriceIntent
  story: ProductStory
  shopSession: ShopSession
  onAddedToCart: () => void
}

export const OfferPresenter = ({ priceIntent, story, shopSession, onAddedToCart }: Props) => {
  const { t } = useTranslation()
  const formatter = useCurrencyFormatter(shopSession.currencyCode)
  const toastRef = useRef<CartToastAttributes | null>(null)
  const [selectedOfferId, setSelectedOfferId] = useState(priceIntent.offers[0].id)
  const selectedOffer = priceIntent.offers.find((offer) => offer.id === selectedOfferId)!

  const product = useMemo(() => {
    return {
      name: story.content.productId,
      displayName: story.content.name,
      currencyCode: shopSession.currencyCode,
      gradient: PLACEHOLDER_GRADIENT,
    }
  }, [story.content, shopSession.currencyCode])

  // TODO: Update start date on change
  const [handleSubmitAddToCart, loadingAddToCart] = useHandleSubmitAddToCart({
    cartId: shopSession.cart.id,
    onSuccess(productOfferId) {
      const addedProdutOffer = priceIntent.offers.find((offer) => offer.id === productOfferId)

      if (addedProdutOffer === undefined) {
        throw new Error(`Unknown offer added to cart: ${productOfferId}`)
      }

      toastRef.current?.publish({
        name: product.displayName,
        price: formatter.format(addedProdutOffer.price.amount),
        gradient: product.gradient,
      })
      onAddedToCart()
    },
  })

  return (
    <>
      <form onSubmit={handleSubmitAddToCart}>
        <FormContent direction="vertical" align="center">
          <Text as="p" align="center" size="l">
            {t('MONTHLY_PRICE', { displayAmount: formatter.format(selectedOffer.price.amount) })}
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

      <CartToast ref={toastRef} />
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
