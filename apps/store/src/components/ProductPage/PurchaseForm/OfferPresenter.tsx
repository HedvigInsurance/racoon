import { useTranslation } from 'next-i18next'
import { useMemo, useRef, useState } from 'react'
import { CartToast, CartToastAttributes } from '@/components/CartNotification/CartToast'
import { Text } from '@/components/Text/Text'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { ProductStory } from '@/services/storyblok/storyblok'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import { TierSelector } from '../TierSelector/TierSelector'

// TODO: get from API
const PLACEHOLDER_GRADIENT = ['#C0E4F3', '#99AAD8'] as const

type Props = {
  priceIntent: PriceIntent
  story: ProductStory
  shopSession: ShopSession
  onAddedToCart: () => void
}

export const OfferPresenter = ({ priceIntent, shopSession, story, onAddedToCart }: Props) => {
  const { t } = useTranslation()
  const formatter = useCurrencyFormatter(shopSession.currencyCode)
  const toastRef = useRef<CartToastAttributes | null>(null)
  const [productOffer, setProductOffer] = useState(priceIntent.offers[0])

  const product = useMemo(() => {
    return {
      name: story.content.productId,
      displayName: story.content.name,
      currencyCode: shopSession.currencyCode,
      gradient: PLACEHOLDER_GRADIENT,
    }
  }, [story.content, shopSession.currencyCode])

  const handleAddedToCart = (productOffer: ProductOfferFragment) => {
    toastRef.current?.publish({
      name: product.displayName,
      price: formatter.format(productOffer.price.amount),
      gradient: product.gradient,
    })
    onAddedToCart()
  }

  return (
    <>
      <Text as="p" align="center" size="l">
        {t('MONTHLY_PRICE', { displayAmount: formatter.format(productOffer.price.amount) })}
      </Text>

      <TierSelector
        product={product}
        productOffer={productOffer}
        onChangeOffer={(newOffer) => setProductOffer(newOffer)}
        cartId={shopSession.cart.id}
        priceIntent={priceIntent}
        onAddedToCart={handleAddedToCart}
      />

      <CartToast ref={toastRef} />
    </>
  )
}
