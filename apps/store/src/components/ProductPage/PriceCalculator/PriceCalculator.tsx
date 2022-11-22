import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useMemo, useRef, useState } from 'react'
import { Button, Heading, Space } from 'ui'
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
import { PriceFormModal } from '../PriceFormModal/PriceFormModal'

// TODO: get from API
const PLACEHOLDER_GRADIENT = ['#C0E4F3', '#99AAD8'] as const

export const PriceCalculator = () => {
  const toastRef = useRef<CartToastAttributes | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { priceTemplate, priceIntent, shopSession } = useProductPageContext()
  const product = usePriceFormProduct()

  const [refreshData, isLoadingData] = useRefreshData()
  const [productOffer, setProductOffer] = useState(priceIntent.offers.find((item) => item.id))
  const handleSuccess = (updatedPriceIntent: PriceIntentFragmentFragment) => {
    setProductOffer(updatedPriceIntent.offers[0])
    refreshData()
    setIsDialogOpen(false)
  }

  const form = useMemo(() => {
    return setupForm(priceTemplate, priceIntent.data, priceIntent.suggestedData)
  }, [priceTemplate, priceIntent])

  const { t } = useTranslation()
  const formatter = useCurrencyFormatter(shopSession.currencyCode)
  let displayCost
  if (productOffer?.price.amount) {
    displayCost = t('MONTHLY_PRICE', { displayAmount: formatter.format(productOffer.price.amount) })
  }

  const apolloClient = useApolloClient()
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

  return (
    <>
      <Space y={1.5}>
        <Wrapper>
          <SpaceFlex space={1} align="center" direction="vertical">
            <Pillow
              size="xlarge"
              fromColor={PLACEHOLDER_GRADIENT[0]}
              toColor={PLACEHOLDER_GRADIENT[1]}
            />
            <Heading as="h2" variant="standard.24">
              {product.displayName}
            </Heading>

            {displayCost && (
              <Text as="p" align="center" size="l">
                {displayCost}
              </Text>
            )}
          </SpaceFlex>
        </Wrapper>

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

        {!productOffer && (
          <Wrapper>
            <Button onClick={() => setIsDialogOpen(true)} fullWidth>
              Calculate price
            </Button>
          </Wrapper>
        )}

        <PriceFormModal
          isOpen={isDialogOpen}
          toggleDialog={setIsDialogOpen}
          header={
            <>
              <Pillow
                size="large"
                fromColor={PLACEHOLDER_GRADIENT[0]}
                toColor={PLACEHOLDER_GRADIENT[1]}
              />
              <Heading as="h2" variant="standard.18">
                {product.displayName}
              </Heading>
            </>
          }
        >
          <PriceForm
            form={form}
            priceIntent={priceIntent}
            onSuccess={handleSuccess}
            onUpdated={refreshData}
            loading={isLoadingData}
          />
        </PriceFormModal>

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

const Wrapper = styled.div({
  paddingLeft: '1rem',
  paddingRight: '1rem',
})
