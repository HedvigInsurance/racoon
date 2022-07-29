import { SbBlokData } from '@storyblok/react'
import { PriceCalculatorBlockProps } from '@/blocks/PriceCalculatorBlock'
import { ProductSummaryBlockContext } from '@/blocks/ProductSummaryBlock'
import { FormTemplate } from '@/services/formTemplate/FormTemplate.types'
import { CountryCode } from '@/services/graphql/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ProductStory, StoryblokBlockName } from '@/services/storyblok/storyblok'

const productGradient = ['#00BFFF', '#00ff00'] as const

type Params = {
  block: SbBlokData
  productStory: ProductStory
  priceIntent: PriceIntent
  priceFormTemplate: FormTemplate
  countryCode: CountryCode
}

export const getBlockContext = ({
  block,
  productStory,
  priceIntent,
  countryCode,
  priceFormTemplate,
}: Params) => {
  const lineItem = priceIntent.lines?.[0]

  switch (block.component) {
    case StoryblokBlockName.ProductSummary:
      return {
        title: block.title || productStory.content.name,
        gradient: productGradient,
      } as ProductSummaryBlockContext

    case StoryblokBlockName.PriceCalculator:
      return {
        lineId: lineItem?.id ?? null,
        priceFormTemplate,
        countryCode,
        product: {
          slug: productStory.slug,
          name: productStory.content.name,
          price: lineItem?.price.amount ?? null,
          currencyCode: productStory.content.currencyCode,
          gradient: productGradient,
        },
      } as PriceCalculatorBlockProps

    default:
      return {}
  }
}
