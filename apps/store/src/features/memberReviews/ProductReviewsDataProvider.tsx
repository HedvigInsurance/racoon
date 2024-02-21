import { createContext, useContext, type PropsWithChildren } from 'react'
import type { ReviewsData } from './memberReviews.types'

const ProductReviewsDataContext = createContext<ReviewsData | null>(null)

type Props = PropsWithChildren<{ productReviewsData: ReviewsData | null }>

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
