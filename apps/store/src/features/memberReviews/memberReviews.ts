import { kv } from '@vercel/kv'
import type { z } from 'zod'
import { getReviewsDistribution, type ReviewsCountByScore } from './getReviewsDistribution'
import type { Score, ReviewsMetadata, ReviewsByScore } from './memberReviews.types'
import type {
  averageRatingSchema,
  reviewCommentsSchema,
  commentByScoreSchema,
} from './memberReviews.utils'
import {
  validateLatestReviews,
  validateProductReviewsComments,
  validateAverageRating,
} from './memberReviews.utils'

// Data format and used keys are defined in the cloud function:
// https://shorturl.at/eoQRV
const KV_KEY = {
  AVRAGE_RATING: 'averageRating',
  LATEST_REVIEWS: 'latestReviews',
  AVRAGE_RATING_BY_PRODUCT: 'averageRatingByProduct',
  LATEST_REVIEWS_BY_PRODUCT: 'latestReviewsByProduct',
}

export const fetchCompanyReviewsMetadata = async (): Promise<ReviewsMetadata | null> => {
  try {
    const [averageRating, reviewsByScore] = await Promise.all([
      fetchCompanyAverageRating(),
      fetchCompanyReviewsByScore(),
    ])

    if (!averageRating || !reviewsByScore) {
      return null
    }

    return {
      averageRating,
      reviewsDistribution: generateReviewsDistribution(reviewsByScore),
    }
  } catch (error) {
    console.log('Failed to fetch company reviews metadata', error)
    return null
  }
}

export const fetchProductReviewsMetadata = async (
  productId: string,
): Promise<ReviewsMetadata | null> => {
  try {
    const [averageRating, reviewsByScore] = await Promise.all([
      fetchProductAverageRating(productId),
      fetchProductReviewsByScore(productId),
    ])

    if (!averageRating || !reviewsByScore) {
      console.log(
        `Member Reviews | Could not found product reviews metadata for product ${productId}`,
      )
      return null
    }

    return {
      averageRating,
      reviewsDistribution: generateReviewsDistribution(reviewsByScore),
    }
  } catch (error) {
    console.log(`Failed to fetch product reviews metadata for product ${productId}`, error)
    return null
  }
}

const fetchCompanyAverageRating = async (): Promise<ReviewsMetadata['averageRating'] | null> => {
  const averageRating = await kv.get<z.infer<typeof averageRatingSchema>>(KV_KEY.AVRAGE_RATING)

  if (!averageRating) {
    console.log('Member Reviews | Could not found get average rating data')
    return null
  }

  const validationResult = validateAverageRating(averageRating)
  if (!validationResult.success) {
    console.log(
      `Member Reviews | product average rating validation error: ${validationResult.error}`,
    )
    return null
  }

  return {
    score: averageRating.score,
    totalOfReviews: averageRating.reviewCount,
  }
}

type CompanyLatestReviewsResponse = { updatedAt: string } & z.infer<typeof commentByScoreSchema>

export const fetchCompanyReviewsByScore = async (): Promise<ReviewsByScore | null> => {
  const latestReviews = await kv.get<CompanyLatestReviewsResponse>(KV_KEY.LATEST_REVIEWS)

  if (!latestReviews) {
    console.log(' Member Reviews | Could not get review comments')
    return null
  }

  const validationResult = validateLatestReviews(latestReviews)
  if (!validationResult.success) {
    console.log(`Member Reviews |  validation error: ${validationResult.error}`)
    return null
  }

  return transformReviews(latestReviews)
}

type AverageRatingsResponse = { updatedAt: string } & Record<
  string,
  z.infer<typeof averageRatingSchema> | undefined
>

const fetchProductAverageRating = async (
  productId: string,
): Promise<ReviewsMetadata['averageRating'] | null> => {
  const averageRatingByProduct = await kv.get<AverageRatingsResponse>(
    KV_KEY.AVRAGE_RATING_BY_PRODUCT,
  )

  if (!averageRatingByProduct) {
    console.log('Member Reviews | Could not found get average rating by product data')
    return null
  }

  const productAverageRating = averageRatingByProduct[productId]
  if (!productAverageRating) {
    console.log(`Member Reviews | Could not found average rating for product ${productId}`)
    return null
  }

  const validationResult = validateAverageRating(productAverageRating)
  if (!validationResult.success) {
    console.log(
      `Member Reviews | product average rating validation error: ${validationResult.error}`,
    )
    return null
  }

  return {
    score: productAverageRating.score,
    totalOfReviews: productAverageRating.reviewCount,
  }
}

type ReviewCommentsResponse = Record<string, z.infer<typeof reviewCommentsSchema> | undefined>

export const fetchProductReviewsByScore = async (
  productId: string,
): Promise<ReviewsByScore | null> => {
  const latestReviewsByProduct = await kv.get<ReviewCommentsResponse>(
    KV_KEY.LATEST_REVIEWS_BY_PRODUCT,
  )

  if (!latestReviewsByProduct) {
    console.log('Member Reviews | Could not get review comments')
    return null
  }

  const latestProductReviews = latestReviewsByProduct[productId]
  if (!latestProductReviews) {
    console.log(`Member Reviews | Could not found review comments for product ${productId}`)
    return null
  }

  const validationResult = validateProductReviewsComments(latestProductReviews)
  if (!validationResult.success) {
    console.log(`Member Reviews |  validation error: ${validationResult.error}`)
    return null
  }

  return transformReviews(latestProductReviews.commentsByScore)
}

const transformReviews = (data: z.infer<typeof commentByScoreSchema>): ReviewsByScore => {
  const reviewsByScore = Object.fromEntries(
    Object.entries(data).map(([score, { total, latestComments }]) => {
      return [
        score,
        {
          total,
          reviews: latestComments,
        },
      ]
    }),
  ) as ReviewsByScore

  return reviewsByScore
}

const generateReviewsDistribution = (
  reviewsByScore: ReviewsByScore,
): ReviewsMetadata['reviewsDistribution'] => {
  const scores: Array<Score> = [5, 4, 3, 2, 1]
  const reviewsCountByScore: ReviewsCountByScore = scores.map((score) => {
    const total = reviewsByScore[score].total
    return [score, total]
  })
  const reviewsDistribution = getReviewsDistribution(reviewsCountByScore)

  return reviewsDistribution
}
