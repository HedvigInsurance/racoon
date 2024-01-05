import { createContext, useContext, type PropsWithChildren } from 'react'
import type { Score, Rating, Review, ReviewsDistribution } from './memberReviews.types'

type ReviewsByScore = Record<
  Score,
  {
    total: number
    reviews: Array<Review>
  }
>

export type ProductReviewsData = {
  averageRating: Rating
  reviewsByScore: ReviewsByScore
  reviewsDistribution: ReviewsDistribution
}

const ProductReviewsDataContext = createContext<ProductReviewsData | null>(null)

type Props = PropsWithChildren<{ productReviewsData: ProductReviewsData | null }>

export const ProductReviewsDataProvider = ({ children, productReviewsData }: Props) => {
  return (
    <ProductReviewsDataContext.Provider value={productReviewsData}>
      {children}
    </ProductReviewsDataContext.Provider>
  )
}

export const useProuctReviewsDataContext = () => {
  const context = useContext(ProductReviewsDataContext)

  return context
}
