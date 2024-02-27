import type { ProductData } from '@/components/ProductData/ProductData.types'
import type { ReviewsMetadata } from '@/features/memberReviews/memberReviews.types'
import { Template } from '@/services/PriceCalculator/PriceCalculator.types'
import { ProductStory, StoryblokPageProps } from '@/services/storyblok/storyblok'

export type ProductPageProps = StoryblokPageProps & {
  story: ProductStory
  priceTemplate: Template
  productData: ProductData
  initialSelectedTypeOfContract?: string
  productReviewsMetadata: ReviewsMetadata | null
}
