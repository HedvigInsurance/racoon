import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { useRef } from 'react'
import { Heading, Space } from 'ui'
import { CartToast, CartToastAttributes } from '@/components/CartNotification/CartToast'
import { PriceCalculatorForm } from '@/components/PriceCalculatorForm/PriceCalculatorForm'
import { useHandleSubmitPriceCalculatorForm } from '@/components/PriceCalculatorForm/useHandleSubmitPriceCalculator'
import { PriceCardForm } from '@/components/PriceCardForm/PriceCardForm'
import { PriceCalculatorFooterForm } from '@/components/ProductPage/PriceCalculatorFooterForm/PriceCalculatorFooterForm'
import { useHandleSubmitAddToCart } from '@/components/ProductPage/useHandleClickAddToCart'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { CurrencyCode } from '@/services/apollo/generated'
import { FormTemplate } from '@/services/formTemplate/FormTemplate.types'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntent.helpers'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'

export type PriceCalculatorBlockContext = {
  cartId: string
  lineId: string | null
  priceIntentId: string
  priceFormTemplate: FormTemplate
  product: {
    slug: string
    name: string
    price: number | null
    currencyCode: CurrencyCode
    gradient: readonly [string, string]
  }
}

export type PriceCalculatorBlockProps = PriceCalculatorBlockContext & {
  title: string
}

type StoryblokPriceCalculatorBlockProps = SbBaseBlockProps<PriceCalculatorBlockProps>

export const PriceCalculatorBlock = ({
  blok: { title, cartId, lineId, priceIntentId, priceFormTemplate, product },
}: StoryblokPriceCalculatorBlockProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const toastRef = useRef<CartToastAttributes | null>(null)
  const formatter = useCurrencyFormatter(product.currencyCode)
  const [handleSubmit, { loading: loadingUpdate }] = useHandleSubmitPriceCalculatorForm({
    priceIntentId,
    formTemplate: priceFormTemplate,
  })

  const [handleSubmitAddToCart, { loading: loadingAddToCart }] = useHandleSubmitAddToCart({
    cartId,
    onSuccess: () => {
      toastRef.current?.publish({
        name: product.name,
        price: formatter.format(product.price ?? 0),
        gradient: product.gradient,
      })
      priceIntentServiceInitClientSide().reset()
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
            id="price-card-form"
            title={product.name}
            cost={product.price ?? undefined}
            currencyCode={product.currencyCode}
            gradient={product.gradient}
            onSubmit={handleSubmitAddToCart}
            loading={loadingAddToCart}
          />
          {lineId && (
            <input form="price-card-form" type="hidden" name="lineItemId" value={lineId} />
          )}
        </SectionWithPadding>
      </Space>

      <PriceCalculatorFooterForm
        id="price-calculator-footer-form"
        targetRef={wrapperRef}
        currencyCode={product.currencyCode}
        price={product.price ?? undefined}
        onSubmit={handleSubmitAddToCart}
        loading={loadingAddToCart}
      />
      {lineId && (
        <input form="price-calculator-footer-form" type="hidden" name="lineItemId" value={lineId} />
      )}

      <CartToast ref={toastRef} />
    </>
  )
}
PriceCalculatorBlock.blockName = 'priceCalculator'

const SectionWithPadding = styled.div(({ theme }) => ({
  paddingLeft: theme.space[3],
  paddingRight: theme.space[3],
}))
