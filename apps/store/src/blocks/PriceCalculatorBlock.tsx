import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { useRef } from 'react'
import { Heading, Space } from 'ui'
import { CartToast, CartToastAttributes } from '@/components/CartNotification/CartToast'
import { PriceCalculatorForm } from '@/components/PriceCalculatorForm/PriceCalculatorForm'
import { useHandleSubmitPriceCalculatorForm } from '@/components/PriceCalculatorForm/useHandleSubmitPriceCalculator'
import { PriceCardForm } from '@/components/PriceCardForm/PriceCardForm'
import { PriceCalculatorFooter } from '@/components/ProductPage/PriceCalculatorFooter/PriceCalculatorFooter'
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
  const lineId = lineItem?.id ?? null
  const product = {
    slug: story.slug,
    name: story.content.name,
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
    cartId: shopSession.cart.id,
    onSuccess: () => {
      toastRef.current?.publish({
        name: product.name,
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

          <form onSubmit={handleSubmit}>
            <PriceCalculatorForm template={priceFormTemplate} loading={loadingUpdate} />
          </form>
        </Space>

        <SectionWithPadding>
          {lineId && (
            <input form="price-card-form" type="hidden" name="lineItemId" value={lineId} />
          )}
          <PriceCardForm
            id="price-card-form"
            title={product.name}
            cost={product.price ?? undefined}
            currencyCode={product.currencyCode}
            gradient={product.gradient}
            onSubmit={handleSubmitAddToCart}
            loading={loadingAddToCart}
          />
        </SectionWithPadding>
      </Space>

      <form onSubmit={handleSubmitAddToCart}>
        {lineId && <input type="hidden" name="lineItemId" value={lineId} />}
        <PriceCalculatorFooter
          targetRef={wrapperRef}
          currencyCode={product.currencyCode}
          price={product.price ?? undefined}
          loading={loadingAddToCart}
        />
      </form>

      <CartToast ref={toastRef} />
    </>
  )
}
PriceCalculatorBlock.blockName = 'priceCalculator'

const SectionWithPadding = styled.div(({ theme }) => ({
  paddingLeft: theme.space[3],
  paddingRight: theme.space[3],
}))
