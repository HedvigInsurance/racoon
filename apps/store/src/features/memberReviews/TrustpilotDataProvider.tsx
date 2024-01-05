import { createContext, useContext, type PropsWithChildren } from 'react'
import type { Rating, Review } from '@/features/memberReviews/memberReviews.types'

export type TrustpilotData = {
  averageRating: Rating
  reviews: Array<Review>
}

const TrustpilotDataContext = createContext<TrustpilotData | null>(null)

type Props = PropsWithChildren<{ trustpilotData: TrustpilotData | null }>

export const TrustpilotDataProvider = ({ children, trustpilotData }: Props) => {
  return (
    <TrustpilotDataContext.Provider value={trustpilotData}>
      {children}
    </TrustpilotDataContext.Provider>
  )
}

export const useTrustpilotData = () => {
  const context = useContext(TrustpilotDataContext)

  return context
}
