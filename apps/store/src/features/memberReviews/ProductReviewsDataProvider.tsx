import { createContext, useContext, type PropsWithChildren } from 'react'
import type { ReviewsDistribution, ReviewsByScore } from './productReviews.types'

export type ProductReviewsData = {
  averageRating: {
    score: number
    totalOfReviews: number
  }
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
