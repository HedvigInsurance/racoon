import { atom, useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { globalStore } from '@/utils/globalStore'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { type RoutingLocale, Language } from '@/utils/l10n/types'
import type { TrustpilotData } from './trustpilot.types'

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

const trustpilotAtom = atom<TrustpilotData | null>(null)

export const useTrustpilotData = () => {
  return useAtomValue(trustpilotAtom, { store: globalStore })
}

export const useHydrateTrustpilotData = (data: TrustpilotData | null) => {
  useHydrateAtoms([[trustpilotAtom, data]], { store: globalStore })
}

export const fetchTrustpilotData = async (locale: RoutingLocale) => {
  try {
    const hedvigBusinessUnitId = process.env.NEXT_PUBLIC_TRUSTPILOT_HEDVIG_BUSINESS_UNIT_ID
    if (!hedvigBusinessUnitId) {
      logMissingSetting(
        'NEXT_PUBLIC_TRUSTPILOT_HEDVIG_BUSINESS_UNIT_ID is not configured, skipping Trustpilot data',
      )
      return null
    }

    const trustpilotApiKey = process.env.TRUSTPILOT_API_KEY
    if (!trustpilotApiKey) {
      logMissingSetting('TRUSTPILOT_API_KEY is not configured, skipping Trustpilot data')
      return null
    }

    const { language } = getLocaleOrFallback(locale)

    const [averageRating, reviews] = await Promise.all([
      fetchAverageRating(hedvigBusinessUnitId, trustpilotApiKey),
      fetchLatestReviews(hedvigBusinessUnitId, trustpilotApiKey, language),
    ])

    return { ...averageRating, reviews }
  } catch (error) {
    console.error(error)
    return null
  }
}

const fetchAverageRating = async (unitId: string, apiKey: string) => {
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
    totalReviews: numberOfReviews.total,
  }
}

const fetchLatestReviews = async (unitId: string, apiKey: string, language: Language) => {
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
    stars: review.stars,
    text: review.text,
    createdAt: review.createdAt,
    isVerified: review.isVerified,
  }))
}

const logMissingSetting = (message: string) => {
  if (process.env.NODE_ENV === 'production') {
    console.warn(message)
  } else {
    console.log(message)
  }
}
