import { useState } from 'react'
import type {
  Score,
  Rating,
  Review,
  ReviewsDistribution,
} from '@/features/memberReviews/memberReviews.types'
import { useProuctReviewsDataContext } from '@/features/memberReviews/ProductReviewsDataProvider'
import { useTrustpilotData } from '@/features/memberReviews/TrustpilotDataProvider'
import { TABS, type Tab } from './ReviewTabs'

export const useReviews = (initialSelectedTab: Tab = TABS.PRODUCT) => {
  const productReviewsData = useProuctReviewsDataContext()
  const trustpilotData = useTrustpilotData()

  const [selectedScore, setSelectedScore] = useState<Score>(() => {
    const defaultScore: Score = 5

    if (productReviewsData?.reviewsByScore) {
      const scores: Array<Score> = [5, 4, 3, 2, 1]
      const initialSelectedScore: Score | undefined = scores.find(
        (score) => productReviewsData.reviewsByScore[score].reviews.length > 0,
      )

      return initialSelectedScore ?? defaultScore
    }

    return defaultScore
  })
  const [selectedTab, setSelectedTab] = useState<Tab>(initialSelectedTab)

  let rating: Rating | null = null
  let reviews: Array<Review> = []
  let reviewsDistribution: ReviewsDistribution = []
  if (selectedTab === TABS.PRODUCT) {
    rating = productReviewsData?.averageRating
      ? {
          score: productReviewsData.averageRating.score,
          totalOfReviews: productReviewsData.averageRating.totalOfReviews,
        }
      : null
    reviews = productReviewsData?.reviewsByScore
      ? productReviewsData.reviewsByScore[selectedScore].reviews
      : []
    reviewsDistribution = productReviewsData?.reviewsDistribution
      ? productReviewsData.reviewsDistribution
      : []
  } else {
    rating = trustpilotData?.averageRating
      ? {
          score: trustpilotData.averageRating.score,
          totalOfReviews: trustpilotData.averageRating.totalOfReviews,
        }
      : null
    reviews = trustpilotData?.reviews ? trustpilotData.reviews : []
    reviewsDistribution = []
  }

  return {
    selectedScore,
    setSelectedScore,
    selectedTab,
    setSelectedTab,
    rating,
    reviews,
    reviewsDistribution,
  }
}
