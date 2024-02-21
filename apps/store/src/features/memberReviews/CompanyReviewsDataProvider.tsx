import { createContext, useContext, type PropsWithChildren } from 'react'
import type { ReviewsData } from './memberReviews.types'

const CompanyReviewsDataContext = createContext<ReviewsData | null>(null)

type Props = PropsWithChildren<{ companyReviewsData: ReviewsData | null }>

export const CompanyReviewsDataProvider = ({ children, companyReviewsData }: Props) => {
  return (
    <CompanyReviewsDataContext.Provider value={companyReviewsData}>
      {children}
    </CompanyReviewsDataContext.Provider>
  )
}

export const useCompanyReviewsDataContext = () => {
  const context = useContext(CompanyReviewsDataContext)

  return context
}
