import { useRef } from 'react'
import { PriceCardForm } from '@/components/PriceCardForm/PriceCardForm'
import { PriceFormProduct } from '@/components/PriceForm/PriceForm.types'
import { PriceCalculatorFooterForm } from '@/components/ProductPage/PriceCalculatorFooterForm/PriceCalculatorFooterForm'
import { PricedProductVariant } from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { useHandleSubmitAddToCart } from '../useHandleSubmitAddToCart'

type Props = {
  cartId: string
  product: PriceFormProduct
  priceIntent: PriceIntent
  onAddedToCart: (pricedVariant: PricedProductVariant) => void
}

export const TierSelector = ({ product, cartId, priceIntent, onAddedToCart }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  // TODO: implement variant selector
  const pricedVariant = priceIntent.variants.find((item) => item.id)

  const [handleSubmitAddToCart, loadingAddToCart] = useHandleSubmitAddToCart({
    cartId,
    onSuccess(pricedVariantId) {
      const pricedVariant = priceIntent.variants.find((variant) => variant.id === pricedVariantId)

      if (pricedVariant === undefined) {
        throw new Error(`Unknown priced variant added to cart: ${pricedVariantId}`)
      }

      onAddedToCart(pricedVariant)
    },
  })

  const variantPrice = pricedVariant ? parseInt(pricedVariant.price.amount, 10) : undefined

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
          pricedVariantId={pricedVariant?.id}
        />
      </div>

      <PriceCalculatorFooterForm
        targetRef={wrapperRef}
        currencyCode={product.currencyCode}
        price={variantPrice}
        loading={loadingAddToCart}
        onSubmit={handleSubmitAddToCart}
        pricedVariantId={pricedVariant?.id}
      />
    </>
  )
}
