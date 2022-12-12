import { ProductDataQuery } from '@/services/apollo/generated'
import { Template } from '@/services/PriceCalculator/PriceCalculator.types'
import { ProductStory, StoryblokPageProps } from '@/services/storyblok/storyblok'

export type ProductData = Exclude<ProductDataQuery['product'], null | undefined>

export type ProductPageProps = StoryblokPageProps & {
  story: ProductStory
  priceTemplate: Template
  productData: ProductData
}
