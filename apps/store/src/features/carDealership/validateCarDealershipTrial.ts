import Crypto from 'crypto'
import { CurrencyCode } from '@/services/graphql/generated'
import { Money } from '@/utils/formatter'

const API_ENDPOINT = `${process.env.RAPIO_API_BASE_URL}/car-dealership/trial`

export type ValidateCarTrialParams = {
  registrationNumber: string
  ssn: string
  dealerId: string
  vtrCoverageCode: string
}

type ResponseData = {
  errorCode: string | null
  errorMessage: string | null
  trialPrice: number | null
}
type ErrorData = { message: string; error: string }

export type CarTrialValidationResult =
  | {
      type: 'error'
      errorCode: string
      errorMessage: string
    }
  | {
      type: 'success'
      trialPrice: Money
    }

export const validateCarDealershipTrial = async (
  params: ValidateCarTrialParams,
): Promise<CarTrialValidationResult> => {
  console.debug(
    `Car Dealership | Validate trial for ${params.registrationNumber} (${params.dealerId})`,
  )
  try {
    const url = new URL(API_ENDPOINT)
    url.searchParams.append('validateOnly', 'true')
    url.searchParams.append('initiatedFrom', params.dealerId)

    const username = process.env.RAPIO_USERNAME_CAR_TRIAL_VALIDATION
    const password = process.env.RAPIO_PASSWORD_CAR_TRIAL_VALIDATION
    const basicAuth = Buffer.from(`${username}:${password}`).toString('base64')

    const body = {
      dealerId: 'car-trial-validation',
      ssn: params.ssn,
      registrationNumber: params.registrationNumber,
      vtrCoverageCode: params.vtrCoverageCode,
      ...getTrialDataPlaceholders(),
    }

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basicAuth}`,
      },
    })

    if (!response.ok) {
      const json = (await response.json()) as ErrorData
      throw new Error(json.error)
    }

    const json = (await response.json()) as ResponseData
    if (json.errorCode) {
      return {
        type: 'error',
        errorCode: json.errorCode,
        errorMessage: json.errorMessage ?? 'Oväntat fel',
      }
    } else {
      return {
        type: 'success',
        trialPrice: {
          amount: json.trialPrice!,
          currencyCode: CurrencyCode.Sek,
        },
      }
    }
  } catch (error) {
    console.warn('Failed to validate trial', error)
    return { type: 'error', errorCode: 'UNKNOWN_ERROR', errorMessage: 'Oväntat fel' }
  }
}

// Required fields but not used in validation
const getTrialDataPlaceholders = () => {
  return {
    email: getRandomEmailAddress(),
    mileage: '1000',
    phoneNumber: '',
    startDate: null,
  }
}

const getRandomEmailAddress = () => {
  const randomId = Crypto.getRandomValues(new Uint32Array(1))[0]
  return `sven.svensson.${randomId}@hedvig.com`
}
