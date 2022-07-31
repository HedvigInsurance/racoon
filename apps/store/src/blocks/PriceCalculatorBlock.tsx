import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { useRef } from 'react'
import { Heading, Space } from 'ui'
import { CartToast, CartToastAttributes } from '@/components/CartNotification/CartToast'
import { PriceCalculatorForm } from '@/components/PriceCalculatorForm/PriceCalculatorForm'
import { useHandleSubmitPriceCalculatorForm } from '@/components/PriceCalculatorForm/useHandleSubmitPriceCalculator'
import { PriceCard } from '@/components/PriceCard/PriceCard'
import { useHandleClickAddToCart } from '@/components/ProductPage/useHandleClickAddToCart'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { CurrencyCode, CountryCode } from '@/services/apollo/generated'
import { FormTemplate } from '@/services/formTemplate/FormTemplate.types'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntent.helpers'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'

export type PriceCalculatorBlockContext = {
  lineId: string | null
  priceFormTemplate: FormTemplate
  countryCode: CountryCode
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
  blok: { title, lineId, priceFormTemplate, countryCode, product },
}: StoryblokPriceCalculatorBlockProps) => {
  const toastRef = useRef<CartToastAttributes | null>(null)
  const formatter = useCurrencyFormatter(product.currencyCode)
  const { handleSubmit } = useHandleSubmitPriceCalculatorForm({ productSlug: product.slug })

  const [handleClickAddToCart] = useHandleClickAddToCart({
    lineId,
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
      <Space y={2} {...storyblokEditable}>
        <Space y={1}>
          <SpaceFlex align="center" direction="vertical">
            <Heading as="h3" variant="standard.18">
              {title}
            </Heading>
          </SpaceFlex>

          <form onSubmit={handleSubmit}>
            <PriceCalculatorForm template={priceFormTemplate} />
            <input type="hidden" name="countryCode" value={countryCode} />
          </form>
        </Space>

        <SectionWithPadding>
          <PriceCard
            name={product.name}
            cost={product.price ?? undefined}
            currencyCode={product.currencyCode}
            gradient={product.gradient}
            onClick={handleClickAddToCart}
          />
        </SectionWithPadding>
      </Space>

      <CartToast ref={toastRef} />
    </>
  )
}

const SectionWithPadding = styled.div(({ theme }) => ({
  paddingLeft: theme.space[3],
  paddingRight: theme.space[3],
}))
