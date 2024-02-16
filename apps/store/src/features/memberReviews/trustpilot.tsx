import type { TrustpilotData } from './TrustpilotDataProvider'

type AverageRatingJSONResponse = {
  score: {
    trustScore: number
  }
  numberOfReviews: {
    total: number
  }
}

export const fetchTrustpilotData = async (): Promise<TrustpilotData | null> => {
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

    const averageRating = await fetchAverageRating(hedvigBusinessUnitId, trustpilotApiKey)

    return { averageRating }
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

const logMissingSetting = (message: string) => {
  if (process.env.NODE_ENV === 'production') {
    console.warn(message)
  } else {
    console.log(message)
  }
}
