import { z } from 'zod'
import { reviewSchema } from './memberReviews.utils'

export type Score = 5 | 4 | 3 | 2 | 1

export type Rating = {
  score: number
  totalOfReviews: number
}

export type Review = z.infer<typeof reviewSchema>

export type ScoreDistributionTuple = [Score, number]

export type ReviewsByScore = Record<Score, { total: number; reviews: Array<Review> }>

export type ReviewsDistribution = Array<ScoreDistributionTuple>

export type ReviewsMetadata = {
  averageRating: Rating
  reviewsDistribution: ReviewsDistribution
}
