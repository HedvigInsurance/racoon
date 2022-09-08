import { SbBlokData } from '@storyblok/react'
import { PriceCalculatorBlock, PriceCalculatorBlockContext } from '@/blocks/PriceCalculatorBlock'
import { ProductSummaryBlock, ProductSummaryBlockContext } from '@/blocks/ProductSummaryBlock'
import { FormTemplate } from '@/services/formTemplate/FormTemplate.types'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { ProductStory } from '@/services/storyblok/storyblok'

const productGradient = ['#00BFFF', '#00ff00'] as const

type Params = {
  block: SbBlokData
  productStory: ProductStory
  priceIntent: PriceIntent
  priceFormTemplate: FormTemplate
  shopSession: ShopSession
}

export const getBlockContext = (params: Params) => {
  switch (params.block.component) {
    case ProductSummaryBlock.blockName:
      return getProductSummaryBlockContext(params)

    case PriceCalculatorBlock.blockName:
      return getPriceCalculatorBlockContext(params)

    default:
      return {}
  }
}

const getProductSummaryBlockContext = ({
  block,
  productStory,
}: Params): ProductSummaryBlockContext => {
  const blockTitle = typeof block.title === 'string' ? block.title : undefined

  return {
    title: blockTitle || productStory.content.name,
    gradient: productGradient,
  }
}

const getPriceCalculatorBlockContext = ({
  productStory,
  shopSession,
  priceIntent,
  priceFormTemplate,
}: Params): PriceCalculatorBlockContext => {
  const lineItem = priceIntent.lines?.[0]

  return {
    cartId: shopSession.cart.id,
    lineId: lineItem?.id ?? null,
    priceFormTemplate,
    priceIntentId: priceIntent.id,
    product: {
      slug: productStory.slug,
      name: productStory.content.name,
      price: parseInt(lineItem?.price.amount, 10) || null,
      currencyCode: shopSession.currencyCode,
      gradient: productGradient,
    },
  }
}
