import { kv } from '@vercel/kv'
import { z } from 'zod'
import { getReviewsDistribution, type ReviewsCountByScore } from './getReviewsDistribution'
import type { Score } from './memberReviews.types'
import {
  averageRatingSchema,
  reviewCommentsSchema,
  validateProductReviewsComments,
  validateProductAverageRating,
} from './productReviews.utils'
import { type ProductReviewsData } from './ProductReviewsDataProvider'

// Data format and used keys are defined in the cloud function:
// https://console.cloud.google.com/functions/details/europe-north1/product_review_v2?env=gen2&cloudshell=false&project=hedvig-dagobah
const KV_AVERAGE_RATINGS_KEY = 'averageRatings'
const KV_REVIEW_COMMENTS_KEY = 'reviews'

type ProductAverageRatingResponse = z.infer<typeof averageRatingSchema>

type AverageRatingsResponse = { updatedAt: string } & Record<
  string,
  ProductAverageRatingResponse | undefined
>

type ProductReviewCommentResponse = z.infer<typeof reviewCommentsSchema>

type ReviewCommentsResponse = Record<string, ProductReviewCommentResponse | undefined>

export const fetchProductReviewsData = async (
  productId: string,
): Promise<ProductReviewsData | null> => {
  try {
    const [averageRating, reviewsByScore] = await Promise.all([
      fetchAverageRating(productId),
      fetchReviewsByScore(productId),
    ])

    if (!averageRating || !reviewsByScore) {
      console.log(`Could not found product reviews data for product ${productId}`)
      return null
    }

    return {
      averageRating,
      reviewsByScore,
      reviewsDistribution: getProductReviewsCountByScore(reviewsByScore),
    }
  } catch (error) {
    console.log(`Failed to fetch product reviews data for product ${productId}`, error)
    return null
  }
}

const fetchAverageRating = async (
  productId: string,
): Promise<ProductReviewsData['averageRating'] | null> => {
  const averageRatings = await kv.get<AverageRatingsResponse>(KV_AVERAGE_RATINGS_KEY)

  if (!averageRatings) {
    console.warn('Could not get average ratings')
    return null
  }

  const productAverageRating = averageRatings[productId]
  if (!productAverageRating) {
    console.warn(`Could not found average ratings for product ${productId}`)
    return null
  }

  const validationResult = validateProductAverageRating(productAverageRating)
  if (!validationResult.success) {
    console.warn(`productAverageRating | validation error: ${validationResult.error}`)
    return null
  }

  return {
    score: productAverageRating.score,
    totalOfReviews: productAverageRating.reviewCount,
  }
}

const fetchReviewsByScore = async (
  productId: string,
): Promise<ProductReviewsData['reviewsByScore'] | null> => {
  const reviewComments = await kv.get<ReviewCommentsResponse>(KV_REVIEW_COMMENTS_KEY)

  if (!reviewComments) {
    console.warn('Could not get review comments')
    return null
  }

  const productReviewComments = reviewComments[productId]
  if (!productReviewComments) {
    console.warn(`Could not found review comments for product ${productId}`)
    return null
  }

  const validationResult = validateProductReviewsComments(productReviewComments)
  if (!validationResult.success) {
    console.warn(`productReviewComments | validation error: ${validationResult.error}`)
    return null
  }

  return parseReviewsByScore(productReviewComments)
}

const parseReviewsByScore = (
  reviewComments: ProductReviewCommentResponse,
): ProductReviewsData['reviewsByScore'] => {
  return Object.entries(reviewComments.commentsByScore).reduce<
    ProductReviewsData['reviewsByScore']
  >(
    (acc, [score, commentsByScore]) => ({
      ...acc,
      [score]: {
        total: commentsByScore.total,
        reviews: commentsByScore.latestComments.map((comment) => ({
          id: comment.id,
          date: comment.date,
          score: comment.score,
          content: comment.content,
        })),
      },
    }),
    {} as ProductReviewsData['reviewsByScore'],
  )
}

const getProductReviewsCountByScore = (
  reviewsByScore: ProductReviewsData['reviewsByScore'],
): ProductReviewsData['reviewsDistribution'] => {
  const scores: Array<Score> = [5, 4, 3, 2, 1]
  const reviewsCountByScore: ReviewsCountByScore = scores.map((score) => {
    const total = reviewsByScore[score].total
    return [score, total]
  })
  const reviewsDistribution = getReviewsDistribution(reviewsCountByScore)

  return reviewsDistribution
}
