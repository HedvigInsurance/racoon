import { useState } from 'react'
import type {
  Score,
  Review,
  Rating,
  ReviewsDistribution,
  ReviewsData,
} from '@/features/memberReviews/memberReviews.types'

export const useReviewsV2 = (reviewsData: ReviewsData | null) => {
  const [selectedScore, setSelectedScore] = useState<Score>(() =>
    getInitialSelectedScore(reviewsData),
  )

  const rating = getRating(reviewsData)
  const reviews = getReviews(reviewsData, selectedScore)
  const reviewsDistribution = getReviewsDistribution(reviewsData)

  return {
    selectedScore,
    setSelectedScore,
    rating,
    reviews,
    reviewsDistribution,
  }
}

const getInitialSelectedScore = (productReviewsData: ReviewsData | null): Score => {
  const defaultScore: Score = 5

  const scores: Array<Score> = [5, 4, 3, 2, 1]
  const initialSelectedScore = productReviewsData
    ? scores.find((score) => productReviewsData.reviewsByScore[score].reviews.length)
    : undefined

  return initialSelectedScore ?? defaultScore
}

const getRating = (productReviewsData: ReviewsData | null): Rating | null => {
  return productReviewsData?.averageRating
    ? {
        score: productReviewsData.averageRating.score,
        totalOfReviews: productReviewsData.averageRating.totalOfReviews,
      }
    : null
}

const getReviews = (
  productReviewsData: ReviewsData | null,
  selectedScore: Score,
): Array<Review> => {
  return productReviewsData?.reviewsByScore
    ? productReviewsData.reviewsByScore[selectedScore].reviews
    : []
}

const getReviewsDistribution = (productReviewsData: ReviewsData | null): ReviewsDistribution => {
  return productReviewsData?.reviewsDistribution ? productReviewsData.reviewsDistribution : []
}
