import { atom, useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { type TrustpilotData } from './trustpilot.types'

type JSONResponse = {
  score: {
    trustScore: number
  }
  numberOfReviews: {
    total: number
  }
}

const trustpilotAtom = atom<TrustpilotData | null>(null)

export const useTrustpilotData = () => {
  return useAtomValue(trustpilotAtom)
}

export const useHydrateTrustpilotData = (data: TrustpilotData | null) => {
  useHydrateAtoms([[trustpilotAtom, data] as const])
}

export const fetchTrustpilotData = async () => {
  try {
    const hedvigBusinessUnitId = process.env.TRUSTPILOT_HEDVIG_BUSINESS_UNIT_ID
    if (!hedvigBusinessUnitId) {
      throw new Error('TRUSTPILOT_HEDVIG_BUSINESS_UNIT_ID is not configured')
    }

    const trustpilotApiKey = process.env.TRUSTPILOT_API_KEY
    if (!trustpilotApiKey) {
      throw new Error('`TRUSTPILOT_API_KEY` is not configured')
    }

    const response = await fetch(
      `https://api.trustpilot.com/v1/business-units/${hedvigBusinessUnitId}`,
      {
        headers: {
          apiKey: trustpilotApiKey,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to retrieve Trustpilot information: ${response.statusText}`)
    }

    const { score, numberOfReviews }: JSONResponse = await response.json()

    return {
      score: score.trustScore,
      totalReviews: numberOfReviews.total,
    }
  } catch (error) {
    console.error(error)
    return null
  }
}
