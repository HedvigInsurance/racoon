import { kv } from '@vercel/kv'
import { AverageRating, ReviewComments } from './productReviews.types'

// Data format and used keys are defined in the cloud function:
// https://console.cloud.google.com/functions/details/europe-north1/product_review_v2?env=gen2&cloudshell=false&project=hedvig-dagobah
const KV_AVERAGE_RATINGS_KEY = 'averageRatings'
const KV_REVIEW_COMMENTS_KEY = 'reviews'

type AverageRatingsData = { updatedAt: string } & Record<string, AverageRating | undefined>

type ReviewCommentsData = Record<string, ReviewComments | undefined>

export const getProductAverageRating = async (productId: string) => {
  const averageRatings = await kv.get<AverageRatingsData>(KV_AVERAGE_RATINGS_KEY)

  if (!averageRatings) {
    console.warn('Could not get average ratings')
    return null
  }

  const productAverageRating = averageRatings[productId]
  if (!productAverageRating) {
    console.warn(`Could not found average ratings for product ${productId}`)
    return null
  }

  return productAverageRating
}

export const getProductReviewComments = async (productId: string) => {
  const reviewComments = await kv.get<ReviewCommentsData>(KV_REVIEW_COMMENTS_KEY)

  if (!reviewComments) {
    console.warn('Could not get review comments')
    return null
  }

  const productReviewComments = reviewComments[productId]
  if (!productReviewComments) {
    console.warn(`Could not found review comments for product ${productId}`)
    return null
  }

  return productReviewComments
}
