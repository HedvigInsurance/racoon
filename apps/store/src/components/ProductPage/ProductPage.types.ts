import { ProductDataQuery } from '@/services/apollo/generated'
import { Template } from '@/services/PriceCalculator/PriceCalculator.types'
import { ProductStory, StoryblokPageProps } from '@/services/storyblok/storyblok'

export type ProductData = Exclude<ProductDataQuery['product'], null | undefined>

export type ProductDataVariant =
  | Exclude<ProductDataQuery['product'], undefined | null>['variants'][number]
  | null

export type ProductPageProps = StoryblokPageProps & {
  story: ProductStory
  priceTemplate: Template
  productData: ProductData
  initialSelectedVariant?: ProductDataVariant
}
