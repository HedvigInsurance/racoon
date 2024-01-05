import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { type RoutingLocale, Language } from '@/utils/l10n/types'
import type { TrustpilotData } from './TrustpilotDataProvider'

type AverageRatingJSONResponse = {
  score: {
    trustScore: number
  }
  numberOfReviews: {
    total: number
  }
}

type ReviewsJSONResponse = {
  reviews: Array<{
    id: string
    stars: number
    text: string
    createdAt: string
    isVerified: boolean
  }>
}

export const fetchTrustpilotData = async (
  locale: RoutingLocale,
): Promise<TrustpilotData | null> => {
  try {
    const hedvigBusinessUnitId = process.env.NEXT_PUBLIC_TRUSTPILOT_HEDVIG_BUSINESS_UNIT_ID
    if (!hedvigBusinessUnitId) {
      logMissingSetting('NEXT_PUBLIC_TRUSTPILOT_HEDVIG_BUSINESS_UNIT_ID is not configured')
      return null
    }

    const trustpilotApiKey = process.env.TRUSTPILOT_API_KEY
    if (!trustpilotApiKey) {
      logMissingSetting('TRUSTPILOT_API_KEY is not configured')
      return null
    }

    const { language } = getLocaleOrFallback(locale)

    const [averageRating, reviews] = await Promise.all([
      fetchAverageRating(hedvigBusinessUnitId, trustpilotApiKey),
      fetchLatestReviews(hedvigBusinessUnitId, trustpilotApiKey, language),
    ])

    return { averageRating, reviews }
  } catch (error) {
    console.error(`Could not get Trustpilot data: ${error}`)
    return null
  }
}

const fetchAverageRating = async (
  unitId: string,
  apiKey: string,
): Promise<TrustpilotData['averageRating']> => {
  const response = await fetch(`https://api.trustpilot.com/v1/business-units/${unitId}`, {
    headers: {
      apiKey,
    },
  })

  if (!response.ok) {
    throw new Error(
      `Failed to retrieve Trustpilot average rating information: ${response.statusText}`,
    )
  }

  const { score, numberOfReviews }: AverageRatingJSONResponse = await response.json()

  return {
    score: score.trustScore,
    totalOfReviews: numberOfReviews.total,
  }
}

const fetchLatestReviews = async (
  unitId: string,
  apiKey: string,
  language: Language,
): Promise<TrustpilotData['reviews']> => {
  const response = await fetch(
    `https://api.trustpilot.com/v1/business-units/${unitId}/reviews?language=${language}&orderBy=createdat.desc&perPage=10&page=1`,
    {
      headers: {
        apiKey,
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to retrieve Trustpilot reviews information: ${response.statusText}`)
  }

  const { reviews }: ReviewsJSONResponse = await response.json()

  return reviews.map((review) => ({
    id: review.id,
    type: 'company',
    score: review.stars,
    date: review.createdAt,
    content: review.text,
  }))
}

const logMissingSetting = (message: string) => {
  if (process.env.NODE_ENV === 'production') {
    console.warn(message)
  } else {
    console.log(message)
  }
}
