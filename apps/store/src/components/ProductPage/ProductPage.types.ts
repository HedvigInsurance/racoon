import type { ProductData } from '@/components/ProductData/ProductData.types'
import type { ReviewsData } from '@/features/memberReviews/memberReviews.types'
import type { TrustpilotData } from '@/features/memberReviews/TrustpilotDataProvider'
import { Template } from '@/services/PriceCalculator/PriceCalculator.types'
import { ProductStory, StoryblokPageProps } from '@/services/storyblok/storyblok'

export type ProductPageProps = StoryblokPageProps & {
  story: ProductStory
  priceTemplate: Template
  productData: ProductData
  initialSelectedTypeOfContract?: string
  trustpilotData: TrustpilotData | null
  productReviewsData: ReviewsData | null
}
