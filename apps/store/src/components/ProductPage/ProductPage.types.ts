import { ProductDataQuery } from '@/services/graphql/generated'
import { Template } from '@/services/PriceCalculator/PriceCalculator.types'
import type { AverageRating, ReviewComments } from '@/services/productReviews/productReviews.types'
import { ProductStory, StoryblokPageProps } from '@/services/storyblok/storyblok'
import { type TrustpilotData } from '@/services/trustpilot/trustpilot.types'

export type ProductData = Exclude<ProductDataQuery['product'], null | undefined>

export type ProductDataVariant =
  | Exclude<ProductDataQuery['product'], undefined | null>['variants'][number]
  | null

export type ProductPageProps = StoryblokPageProps & {
  story: ProductStory
  priceTemplate: Template
  productData: ProductData
  initialSelectedTypeOfContract?: string
  trustpilot: TrustpilotData | null
  averageRating: AverageRating | null
  reviewComments: ReviewComments | null
}
