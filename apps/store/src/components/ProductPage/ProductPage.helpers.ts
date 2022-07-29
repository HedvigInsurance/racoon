import { SbBlokData } from '@storyblok/react'
import { PriceCalculatorBlockContext } from '@/blocks/PriceCalculatorBlock'
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

export const getBlockContext = (params: Params) => {
  switch (params.block.component) {
    case StoryblokBlockName.ProductSummary:
      return getProductSummaryBlockContext(params)

    case StoryblokBlockName.PriceCalculator:
      return getPriceCalculatorBlockContext(params)

    default:
      return {}
  }
}

const getProductSummaryBlockContext = ({
  block,
  productStory,
}: Params): ProductSummaryBlockContext => {
  return {
    title: typeof block.title === 'string' ? block.title : productStory.content.name,
    gradient: productGradient,
  }
}

const getPriceCalculatorBlockContext = ({
  productStory,
  countryCode,
  priceIntent,
  priceFormTemplate,
}: Params): PriceCalculatorBlockContext => {
  const lineItem = priceIntent.lines?.[0]

  return {
    lineId: lineItem?.id ?? null,
    priceFormTemplate,
    countryCode,
    product: {
      slug: productStory.slug,
      name: productStory.content.name,
      price: lineItem?.price.amount ?? null,
      gradient: productGradient,
    },
  }
}
