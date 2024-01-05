import type { ProductData } from '@/components/ProductData/ProductData.types'
import type { TrustpilotData } from '@/features/memberReviews/trustpilot.types'
import { Template } from '@/services/PriceCalculator/PriceCalculator.types'
import type { AverageRating, ReviewComments } from '@/services/productReviews/productReviews.types'
import { ProductStory, StoryblokPageProps } from '@/services/storyblok/storyblok'

export type ProductPageProps = StoryblokPageProps & {
  story: ProductStory
  priceTemplate: Template
  productData: ProductData
  initialSelectedTypeOfContract?: string
  averageRating: AverageRating | null
  reviewComments: ReviewComments | null
  trustpilotData: TrustpilotData | null
}
