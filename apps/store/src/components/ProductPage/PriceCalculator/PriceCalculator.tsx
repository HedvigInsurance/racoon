import { useApolloClient } from '@apollo/client'
import { useMemo, useRef, useState } from 'react'
import { Heading, Space } from 'ui'
import { CartToast, CartToastAttributes } from '@/components/CartNotification/CartToast'
import { Pillow } from '@/components/Pillow/Pillow'
import { PriceForm } from '@/components/PriceForm/PriceForm'
import { PriceFormProduct } from '@/components/PriceForm/PriceForm.types'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { TierSelector } from '@/components/ProductPage/TierSelector/TierSelector'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Text } from '@/components/Text/Text'
import { PriceIntentFragmentFragment, ProductOfferFragment } from '@/services/apollo/generated'
import { setupForm } from '@/services/PriceForm/PriceForm.helpers'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntent.helpers'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import { useRefreshData } from '@/utils/useRefreshData'

// TODO: get from API
const PLACEHOLDER_GRADIENT = ['#C0E4F3', '#99AAD8'] as const

type Props = { title: string }

export const PriceCalculator = ({ title }: Props) => {
  const toastRef = useRef<CartToastAttributes | null>(null)

  const { priceTemplate, priceIntent, shopSession } = useProductPageContext()
  const product = usePriceFormProduct()

  const [refreshData, isLoadingData] = useRefreshData()
  const [productOffer, setProductOffer] = useState(priceIntent.offers.find((item) => item.id))
  const handleSuccess = (updatedPriceIntent: PriceIntentFragmentFragment) => {
    setProductOffer(updatedPriceIntent.offers[0])
    refreshData()
  }

  const form = useMemo(() => {
    return setupForm(priceTemplate, priceIntent.data, priceIntent.suggestedData)
  }, [priceTemplate, priceIntent])

  const apolloClient = useApolloClient()
  const formatter = useCurrencyFormatter(shopSession.currencyCode)
  const handleAddedToCart = (productOffer: ProductOfferFragment) => {
    setProductOffer(undefined)
    toastRef.current?.publish({
      name: product.displayName,
      price: formatter.format(productOffer.price.amount),
      gradient: product.gradient,
    })

    priceIntentServiceInitClientSide({ shopSession, apolloClient }).clear(priceTemplate.name)
    refreshData()
  }

  const offerCost = productOffer?.price.amount
  const displayCost = offerCost ? `${shopSession.currencyCode} ${offerCost} /mth.` : undefined

  return (
    <>
      <Space y={1.5}>
        <SpaceFlex space={1} align="center" direction="vertical">
          <Pillow
            size="xlarge"
            fromColor={PLACEHOLDER_GRADIENT[0]}
            toColor={PLACEHOLDER_GRADIENT[1]}
          />
          <Heading as="h2" variant="standard.24">
            {product.displayName}
          </Heading>

          {!productOffer && (
            <Text color="gray600" size="l">
              {title}
            </Text>
          )}
        </SpaceFlex>

        {displayCost && (
          <Text as="p" align="center" size="l">
            {displayCost}
          </Text>
        )}

        {productOffer && (
          <TierSelector
            product={product}
            productOffer={productOffer}
            onChangeOffer={(newOffer) => setProductOffer(newOffer)}
            cartId={shopSession.cart.id}
            priceIntent={priceIntent}
            onAddedToCart={handleAddedToCart}
          />
        )}

        <Space y={1}>
          <PriceForm
            form={form}
            priceIntent={priceIntent}
            onSuccess={handleSuccess}
            onUpdated={refreshData}
            loading={isLoadingData}
          />
        </Space>

        <CartToast ref={toastRef} />
      </Space>
    </>
  )
}

const usePriceFormProduct = () => {
  const { story, shopSession } = useProductPageContext()

  return useMemo<PriceFormProduct>(() => {
    return {
      name: story.content.productId,
      displayName: story.content.name,
      currencyCode: shopSession.currencyCode,
      gradient: PLACEHOLDER_GRADIENT,
    }
  }, [story.content, shopSession.currencyCode])
}
