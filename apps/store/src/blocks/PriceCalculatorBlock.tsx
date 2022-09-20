import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { useRef } from 'react'
import { Heading, Space } from 'ui'
import { CartToast, CartToastAttributes } from '@/components/CartNotification/CartToast'
import { PriceCalculatorForm } from '@/components/PriceCalculatorForm/PriceCalculatorForm'
import { useHandleSubmitPriceCalculatorForm } from '@/components/PriceCalculatorForm/useHandleSubmitPriceCalculator'
import { PriceCardForm } from '@/components/PriceCardForm/PriceCardForm'
import { PriceCalculatorFooterForm } from '@/components/ProductPage/PriceCalculatorFooterForm/PriceCalculatorFooterForm'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { useHandleSubmitAddToCart } from '@/components/ProductPage/useHandleClickAddToCart'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'

const PLACEHOLDER_GRADIENT = ['#00BFFF', '#00ff00'] as const

type StoryblokPriceCalculatorBlockProps = SbBaseBlockProps<{
  title: string
}>

export const PriceCalculatorBlock = ({ blok: { title } }: StoryblokPriceCalculatorBlockProps) => {
  const { shopSession, priceIntent, story, priceFormTemplate } = useProductPageContext()
  const lineItem = priceIntent.lines?.[0]
  const product = {
    slug: story.slug,
    name: story.content.productId,
    displayName: story.content.name,
    price: parseInt(lineItem?.price.amount, 10) || null,
    currencyCode: shopSession.currencyCode,
    gradient: PLACEHOLDER_GRADIENT,
  }

  const wrapperRef = useRef<HTMLDivElement>(null)
  const toastRef = useRef<CartToastAttributes | null>(null)
  const formatter = useCurrencyFormatter(product.currencyCode)
  const [handleSubmit, loadingUpdate] = useHandleSubmitPriceCalculatorForm({
    priceIntentId: priceIntent.id,
    formTemplate: priceFormTemplate,
  })

  const [handleSubmitAddToCart, loadingAddToCart] = useHandleSubmitAddToCart({
    shopSession,
    cartId: shopSession.cart.id,
    productName: product.name,
    onSuccess: () => {
      toastRef.current?.publish({
        name: product.displayName,
        price: formatter.format(product.price ?? 0),
        gradient: product.gradient,
      })
    },
  })

  return (
    <>
      <Space y={2} ref={wrapperRef} {...storyblokEditable}>
        <Space y={1}>
          <SpaceFlex align="center" direction="vertical">
            <Heading as="h3" variant="standard.18">
              {title}
            </Heading>
          </SpaceFlex>

          <PriceCalculatorForm
            template={priceFormTemplate}
            onSubmit={handleSubmit}
            loading={loadingUpdate}
          />
        </Space>

        <SectionWithPadding>
          <PriceCardForm
            title={product.displayName}
            cost={product.price ?? undefined}
            currencyCode={product.currencyCode}
            gradient={product.gradient}
            onSubmit={handleSubmitAddToCart}
            loading={loadingAddToCart}
            lineItemId={lineItem?.id}
          />
        </SectionWithPadding>
      </Space>

      <PriceCalculatorFooterForm
        targetRef={wrapperRef}
        currencyCode={product.currencyCode}
        price={product.price ?? undefined}
        loading={loadingAddToCart}
        onSubmit={handleSubmitAddToCart}
        lineItemId={lineItem?.id}
      />

      <CartToast ref={toastRef} />
    </>
  )
}
PriceCalculatorBlock.blockName = 'priceCalculator'

const SectionWithPadding = styled.div(({ theme }) => ({
  paddingLeft: theme.space[3],
  paddingRight: theme.space[3],
}))
