import { useState } from 'react'
import type {
  Score,
  Rating,
  Review,
  ReviewsDistribution,
} from '@/features/memberReviews/memberReviews.types'
import {
  ProductReviewsData,
  useProuctReviewsDataContext,
} from '@/features/memberReviews/ProductReviewsDataProvider'

export const useReviewsV2 = () => {
  const productReviewsData = useProuctReviewsDataContext()

  const [selectedScore, setSelectedScore] = useState<Score>(() =>
    getInitialSelectedScore(productReviewsData),
  )

  const rating = getRating(productReviewsData)
  const reviews = getReviews(productReviewsData, selectedScore)
  const reviewsDistribution = getReviewsDistribution(productReviewsData)

  return {
    selectedScore,
    setSelectedScore,
    rating,
    reviews,
    reviewsDistribution,
  }
}

const getInitialSelectedScore = (productReviewsData: ProductReviewsData | null): Score => {
  const defaultScore: Score = 5

  const scores: Array<Score> = [5, 4, 3, 2, 1]
  const initialSelectedScore = productReviewsData
    ? scores.find((score) => productReviewsData.reviewsByScore[score].reviews.length)
    : undefined

  return initialSelectedScore ?? defaultScore
}

const getRating = (productReviewsData: ProductReviewsData | null): Rating | null => {
  return productReviewsData?.averageRating
    ? {
        score: productReviewsData.averageRating.score,
        totalOfReviews: productReviewsData.averageRating.totalOfReviews,
      }
    : null
}

const getReviews = (
  productReviewsData: ProductReviewsData | null,
  selectedScore: Score,
): Array<Review> => {
  return productReviewsData?.reviewsByScore
    ? productReviewsData.reviewsByScore[selectedScore].reviews
    : []
}

const getReviewsDistribution = (
  productReviewsData: ProductReviewsData | null,
): ReviewsDistribution => {
  return productReviewsData?.reviewsDistribution ? productReviewsData.reviewsDistribution : []
}
