import { useRef } from 'react'
import { PriceCardForm } from '@/components/PriceCardForm/PriceCardForm'
import { PriceFormProduct } from '@/components/PriceForm/PriceForm.types'
import { PriceCalculatorFooterForm } from '@/components/ProductPage/PriceCalculatorFooterForm/PriceCalculatorFooterForm'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { useHandleSubmitAddToCart } from '../useHandleSubmitAddToCart'

type Props = {
  cartId: string
  product: PriceFormProduct
  productOffer: ProductOfferFragment
  onChangeOffer: (offer: ProductOfferFragment) => void
  priceIntent: PriceIntent
  onAddedToCart: (offer: ProductOfferFragment) => void
}

export const TierSelector = (props: Props) => {
  const { product, productOffer, onChangeOffer, cartId, priceIntent, onAddedToCart } = props
  const wrapperRef = useRef<HTMLDivElement>(null)

  const [handleSubmitAddToCart, loadingAddToCart] = useHandleSubmitAddToCart({
    cartId,
    onSuccess(productOfferId) {
      const addedProdutOffer = priceIntent.offers.find((offer) => offer.id === productOfferId)

      if (addedProdutOffer === undefined) {
        throw new Error(`Unknown offer added to cart: ${productOfferId}`)
      }

      onAddedToCart(addedProdutOffer)
    },
  })

  return (
    <div ref={wrapperRef}>
      <PriceCardForm
        onSubmit={handleSubmitAddToCart}
        loading={loadingAddToCart}
        offers={priceIntent.offers}
        selectedOffer={productOffer}
        onChangeOffer={onChangeOffer}
      />

      <PriceCalculatorFooterForm
        targetRef={wrapperRef}
        currencyCode={product.currencyCode}
        price={productOffer.price.amount}
        loading={loadingAddToCart}
        onSubmit={handleSubmitAddToCart}
        productOfferId={productOffer.id}
      />
    </div>
  )
}
