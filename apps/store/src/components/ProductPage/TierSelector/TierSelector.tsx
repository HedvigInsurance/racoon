import { useRef } from 'react'
import { PriceCardForm } from '@/components/PriceCardForm/PriceCardForm'
import { PriceFormProduct } from '@/components/PriceForm/PriceForm.types'
import { PriceCalculatorFooterForm } from '@/components/ProductPage/PriceCalculatorFooterForm/PriceCalculatorFooterForm'
import { ProductOffer } from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { useHandleSubmitAddToCart } from '../useHandleSubmitAddToCart'

type Props = {
  cartId: string
  product: PriceFormProduct
  priceIntent: PriceIntent
  onAddedToCart: (pricedVariant: ProductOffer) => void
}

export const TierSelector = ({ product, cartId, priceIntent, onAddedToCart }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  // TODO: implement offer selector
  const productOffer = priceIntent.offers.find((item) => item.id)

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

  const variantPrice = productOffer ? productOffer.price.amount : undefined

  return (
    <>
      <div>
        <PriceCardForm
          title={product.displayName}
          currencyCode={product.currencyCode}
          gradient={product.gradient}
          onSubmit={handleSubmitAddToCart}
          loading={loadingAddToCart}
          cost={variantPrice}
          pricedVariantId={productOffer?.id}
        />
      </div>

      <PriceCalculatorFooterForm
        targetRef={wrapperRef}
        currencyCode={product.currencyCode}
        price={variantPrice}
        loading={loadingAddToCart}
        onSubmit={handleSubmitAddToCart}
        pricedVariantId={productOffer?.id}
      />
    </>
  )
}
