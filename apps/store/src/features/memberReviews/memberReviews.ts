import { kv } from '@vercel/kv'
import { z } from 'zod'
import { getReviewsDistribution, type ReviewsCountByScore } from './getReviewsDistribution'
import type { Score, ReviewsData } from './memberReviews.types'
import {
  averageRatingSchema,
  reviewCommentsSchema,
  commentByScoreSchema,
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

export const fetchCompanyReviewsData = async (): Promise<ReviewsData | null> => {
  try {
    const [averageRating, reviewsByScore] = await Promise.all([
      fetchCompanyAverageRating(),
      fetchCompanyLatestReviews(),
    ])

    if (!averageRating || !reviewsByScore) {
      return null
    }

    return {
      averageRating,
      reviewsByScore,
      reviewsDistribution: generateReviewsDistribution(reviewsByScore),
    }
  } catch (error) {
    console.log('Failed to fetch company reviews data', error)
    return null
  }
}

const fetchCompanyAverageRating = async (): Promise<ReviewsData['averageRating'] | null> => {
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

const fetchCompanyLatestReviews = async (): Promise<ReviewsData['reviewsByScore'] | null> => {
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

  return transformCompanyReviews(latestReviews)
}

const transformCompanyReviews = (
  reviewComments: CompanyLatestReviewsResponse,
): ReviewsData['reviewsByScore'] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { updatedAt, ...commentsByScore } = reviewComments

  return Object.entries(commentsByScore).reduce(
    (acc, [score, data]) => {
      return {
        ...acc,
        [score]: {
          total: data.total,
          reviews: data.latestComments.map((comment) => ({
            id: comment.id,
            date: comment.date,
            score: comment.score,
            content: comment.content,
            tag: comment.tag,
          })),
        },
      }
    },
    {} as ReviewsData['reviewsByScore'],
  )
}

export const fetchProductReviewsData = async (productId: string): Promise<ReviewsData | null> => {
  try {
    const [averageRating, reviewsByScore] = await Promise.all([
      fetchProductAverageRating(productId),
      fetchProductLatestReviews(productId),
    ])

    if (!averageRating || !reviewsByScore) {
      console.log(`Member Reviews | Could not found product reviews data for product ${productId}`)
      return null
    }

    return {
      averageRating,
      reviewsByScore,
      reviewsDistribution: generateReviewsDistribution(reviewsByScore),
    }
  } catch (error) {
    console.log(`Failed to fetch product reviews data for product ${productId}`, error)
    return null
  }
}

type AverageRatingsResponse = { updatedAt: string } & Record<
  string,
  z.infer<typeof averageRatingSchema> | undefined
>

const fetchProductAverageRating = async (
  productId: string,
): Promise<ReviewsData['averageRating'] | null> => {
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

const fetchProductLatestReviews = async (
  productId: string,
): Promise<ReviewsData['reviewsByScore'] | null> => {
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

  return transformProductReviews(latestProductReviews)
}

const transformProductReviews = (
  reviewComments: z.infer<typeof reviewCommentsSchema>,
): ReviewsData['reviewsByScore'] => {
  return Object.entries(reviewComments.commentsByScore).reduce<ReviewsData['reviewsByScore']>(
    (acc, [score, commentsByScore]) => ({
      ...acc,
      [score]: {
        total: commentsByScore.total,
        reviews: commentsByScore.latestComments.map((comment) => ({
          id: comment.id,
          date: comment.date,
          score: comment.score,
          content: comment.content,
          tag: reviewComments.tag,
        })),
      },
    }),
    {} as ReviewsData['reviewsByScore'],
  )
}

const generateReviewsDistribution = (
  reviewsByScore: ReviewsData['reviewsByScore'],
): ReviewsData['reviewsDistribution'] => {
  const scores: Array<Score> = [5, 4, 3, 2, 1]
  const reviewsCountByScore: ReviewsCountByScore = scores.map((score) => {
    const total = reviewsByScore[score].total
    return [score, total]
  })
  const reviewsDistribution = getReviewsDistribution(reviewsCountByScore)

  return reviewsDistribution
}
