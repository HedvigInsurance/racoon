import type { ProductData } from '@/components/ProductData/ProductData.types'
import { Template } from '@/services/PriceCalculator/PriceCalculator.types'
import type { AverageRating, ReviewComments } from '@/services/productReviews/productReviews.types'
import { ProductStory, StoryblokPageProps } from '@/services/storyblok/storyblok'
import { type TrustpilotData } from '@/services/trustpilot/trustpilot.types'

export type ProductPageProps = StoryblokPageProps & {
  story: ProductStory
  priceTemplate: Template
  productData: ProductData
  initialSelectedTypeOfContract?: string
  trustpilot: TrustpilotData | null
  averageRating: AverageRating | null
  reviewComments: ReviewComments | null
}
