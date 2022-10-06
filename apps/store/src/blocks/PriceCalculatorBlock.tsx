import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import { useMemo, useRef } from 'react'
import { Heading, Space } from 'ui'
import { CartToast, CartToastAttributes } from '@/components/CartNotification/CartToast'
import { PriceForm } from '@/components/PriceForm/PriceForm'
import { PriceFormProduct } from '@/components/PriceForm/PriceForm.types'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { TierSelector } from '@/components/ProductPage/TierSelector/TierSelector'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { ProductOffer } from '@/services/apollo/generated'
import { setupForm } from '@/services/PriceForm/PriceForm.helpers'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntent.helpers'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import { useRefreshData } from '@/utils/useRefreshData'

// TODO: get from API
const PLACEHOLDER_GRADIENT = ['#00BFFF', '#00ff00'] as const

type Props = SbBaseBlockProps<{
  title: string
}>

export const PriceCalculatorBlock = ({ blok }: Props) => {
  const toastRef = useRef<CartToastAttributes | null>(null)

  const { priceTemplate, priceIntent, shopSession } = useProductPageContext()
  const product = usePriceFormProduct()

  const [refreshData, isLoadingData] = useRefreshData()
  const handleSuccess = refreshData

  const form = useMemo(() => {
    return setupForm(priceTemplate, priceIntent.data, priceIntent.suggestedData)
  }, [priceTemplate, priceIntent])

  const apolloClient = useApolloClient()
  const formatter = useCurrencyFormatter(shopSession.currencyCode)
  const handleAddedToCart = (productOffer: ProductOffer) => {
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
      <Space y={1}>
        <SpaceFlex align="center" direction="vertical">
          <Heading as="h2" variant="standard.18">
            {blok.title}
          </Heading>
        </SpaceFlex>

        <PriceForm
          form={form}
          priceIntent={priceIntent}
          onSuccess={handleSuccess}
          loading={isLoadingData}
        />

        <SectionWithPadding>
          <TierSelector
            product={product}
            cartId={shopSession.cart.id}
            priceIntent={priceIntent}
            onAddedToCart={handleAddedToCart}
          />
        </SectionWithPadding>

        <CartToast ref={toastRef} />
      </Space>
    </>
  )
}
PriceCalculatorBlock.blockName = 'priceCalculator'

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

const SectionWithPadding = styled.div(({ theme }) => ({
  paddingLeft: theme.space[3],
  paddingRight: theme.space[3],
}))
