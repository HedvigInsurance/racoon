import type { ProductData } from '@/components/ProductData/ProductData.types'
import { type ProductReviewsData } from '@/features/memberReviews/ProductReviewsDataProvider'
import type { TrustpilotData } from '@/features/memberReviews/trustpilot.types'
import { Template } from '@/services/PriceCalculator/PriceCalculator.types'
import { ProductStory, StoryblokPageProps } from '@/services/storyblok/storyblok'

export type ProductPageProps = StoryblokPageProps & {
  story: ProductStory
  priceTemplate: Template
  productData: ProductData
  initialSelectedTypeOfContract?: string
  trustpilotData: TrustpilotData | null
  productReviewsData: ProductReviewsData | null
}
