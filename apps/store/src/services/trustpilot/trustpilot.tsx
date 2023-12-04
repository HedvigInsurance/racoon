import { atom, useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { globalStore } from '@/utils/globalStore'
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
  return useAtomValue(trustpilotAtom, { store: globalStore })
}

export const useHydrateTrustpilotData = (data: TrustpilotData | null) => {
  useHydrateAtoms([[trustpilotAtom, data]], { store: globalStore })
}

export const fetchTrustpilotData = async () => {
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

const logMissingSetting = (message: string) => {
  if (process.env.NODE_ENV === 'production') {
    console.warn(message)
  } else {
    console.log(message)
  }
}
