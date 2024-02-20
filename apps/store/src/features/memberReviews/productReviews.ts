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
// https://shorturl.at/eoQRV
const KV_AVERAGE_RATING_BY_PRODUCT_KEY = 'averageRatingByProduct'
const KV_LATEST_REVIEWS_BY_PRODUCT_KEY = 'latestReviewsByProduct'

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
      fetchAverageRatingByProduct(productId),
      fetchLatestReviewsByProduct(productId),
    ])

    if (!averageRating || !reviewsByScore) {
      console.log(`Product Reviews | Could not found product reviews data for product ${productId}`)
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

const fetchAverageRatingByProduct = async (
  productId: string,
): Promise<ProductReviewsData['averageRating'] | null> => {
  const averageRatingByProduct = await kv.get<AverageRatingsResponse>(
    KV_AVERAGE_RATING_BY_PRODUCT_KEY,
  )

  if (!averageRatingByProduct) {
    console.warn('Product Reviews | Could not get average ratings')
    return null
  }

  const productAverageRating = averageRatingByProduct[productId]
  if (!productAverageRating) {
    console.warn(`Product Reviews | Could not found average rating for product ${productId}`)
    return null
  }

  const validationResult = validateProductAverageRating(productAverageRating)
  if (!validationResult.success) {
    console.warn(
      `Product Reviews | product average rating validation error: ${validationResult.error}`,
    )
    return null
  }

  return {
    score: productAverageRating.score,
    totalOfReviews: productAverageRating.reviewCount,
  }
}

const fetchLatestReviewsByProduct = async (
  productId: string,
): Promise<ProductReviewsData['reviewsByScore'] | null> => {
  const latestReviewsByProduct = await kv.get<ReviewCommentsResponse>(
    KV_LATEST_REVIEWS_BY_PRODUCT_KEY,
  )

  if (!latestReviewsByProduct) {
    console.warn(' Product Reviews | Could not get review comments')
    return null
  }

  const latestProductReviews = latestReviewsByProduct[productId]
  if (!latestProductReviews) {
    console.warn(`Product Reviews | Could not found review comments for product ${productId}`)
    return null
  }

  const validationResult = validateProductReviewsComments(latestProductReviews)
  if (!validationResult.success) {
    console.warn(`Product Reviews |  validation error: ${validationResult.error}`)
    return null
  }

  return parseReviewsByScore(latestProductReviews)
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
          type: 'product',
          date: comment.date,
          score: comment.score,
          content: comment.content,
          tag: reviewComments.tag,
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
