import { kv } from '@vercel/kv'
import { type AverageRating } from '@/components/ProductPage/ProductPage.types'

const KV_KEY = 'product_reviews'

type AverageRatingsData = { updatedAt: string } & Record<string, AverageRating | undefined>

export const getProductAverageRating = async (productId: string) => {
  const averageRatings = await kv.get<AverageRatingsData>(KV_KEY)

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
