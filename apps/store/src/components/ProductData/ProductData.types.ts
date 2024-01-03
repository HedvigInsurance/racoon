import type { ReviewsDistribution } from '@/components/ProductReviews/ProductReviews.types'
import { ProductDataQuery } from '@/services/graphql/generated'
import type { AverageRating, ReviewComments } from '@/services/productReviews/productReviews.types'

export type ProductData = NonNullable<ProductDataQuery['product']> & {
  averageRating: AverageRating | null
  reviewComments: ReviewComments | null
  reviewsDistribution: ReviewsDistribution | null
}
