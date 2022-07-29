import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { Heading, Space } from 'ui'
import { PriceCalculator } from '@/components/PriceCalculator/PriceCalculator'
import { useHandleSubmitPriceCalculator } from '@/components/PriceCalculator/useHandleSubmitPriceCalculator'
import { PriceCard } from '@/components/PriceCard/PriceCard'
import { useHandleClickAddToCart } from '@/components/ProductPage/useHandleClickAddToCart'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { FormTemplate } from '@/services/formTemplate/FormTemplate.types'
import { CountryCode } from '@/services/graphql/generated'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

export type PriceCalculatorBlockContext = {
  lineId: string | null
  priceFormTemplate: FormTemplate
  countryCode: CountryCode
  product: {
    slug: string
    name: string
    price: number | null
    currencyCode: string
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
  const { handleSubmit } = useHandleSubmitPriceCalculator({ productSlug: product.slug })
  const [handleClickAddToCart] = useHandleClickAddToCart({ lineId })

  return (
    <Space y={2} {...storyblokEditable}>
      <Space y={1}>
        <SpaceFlex align="center" direction="vertical">
          <Heading as="h3" variant="standard.18">
            {title}
          </Heading>
        </SpaceFlex>

        <form onSubmit={handleSubmit}>
          <PriceCalculator template={priceFormTemplate} />
          <input type="hidden" name="countryCode" value={countryCode} />
        </form>
      </Space>

      <SectionWithPadding>
        <PriceCard
          name={product.name}
          cost={product.price ?? undefined}
          currency={product.currencyCode}
          gradient={product.gradient}
          onClick={handleClickAddToCart}
        />
      </SectionWithPadding>
    </Space>
  )
}

const SectionWithPadding = styled.div(({ theme }) => ({
  paddingLeft: theme.space[3],
  paddingRight: theme.space[3],
}))
