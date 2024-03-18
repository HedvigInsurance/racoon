import Crypto from 'crypto'
import { wait } from '@/utils/wait'

const API_ENDPOINT = `${process.env.RAPIO_API_BASE_URL}/car-dealership/trial`

export type CreateCarTrialParams = {
  registrationNumber: string
  ssn: string
  dealerId: string
  vtrCoverageCode: string
}

type ResponseData = {
  errorCode: string | null
  errorMessage: string | null
  trialId: string | null
  trialPrice: number | null
}

type ResponseDataTrialContract = {
  trialContractId: string | null
  trialUrl: string | null
  state: string | null
  error: string | null
  message: string | null
}

type ErrorData = { message: string; error: string }

export type CarTrialResult =
  | {
      type: 'error'
      errorCode: string
      errorMessage: string
    }
  | {
      type: 'success'
      trialUrl: string
    }

const getTrialContract = async (trialId: string, basicAuth: string): Promise<CarTrialResult> => {
  let retries = 5

  // Retry fetching trial contract 5 times since it takes a while to generate
  while (retries > 0) {
    try {
      const response = await fetch(
        `https://gateway.test.hedvig.com/car-dealership/trial/${trialId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${basicAuth}`,
          },
        },
      )

      const json = (await response.json()) as ResponseDataTrialContract

      if (json.trialUrl) {
        return {
          type: 'success',
          trialUrl: json.trialUrl,
        }
      }

      console.log('Retrying getting trial contract...')
      retries--
      await wait(1000)
    } catch (error) {
      console.warn('Failed to fetch trial contract', error)
      return {
        type: 'error',
        errorCode: 'RETRIES_EXCEEDED',
        errorMessage: 'Max retries exceeded, no trial contract',
      }
    }
  }

  return {
    type: 'error',
    errorCode: 'UNKNOWN_ERROR',
    errorMessage: 'Failed to fetch trial contract',
  }
}

export const createCarDealershipTrial = async (
  params: CreateCarTrialParams,
): Promise<CarTrialResult> => {
  try {
    const url = new URL(API_ENDPOINT)
    url.searchParams.append('validateOnly', 'false')
    url.searchParams.append('initiatedFrom', params.dealerId)

    const username = process.env.RAPIO_USERNAME_CAR_TRIAL_DEBUGGER
    const password = process.env.RAPIO_PASSWORD_CAR_TRIAL_DEBUGGER
    const basicAuth = Buffer.from(`${username}:${password}`).toString('base64')

    const body = {
      dealerId: params.dealerId,
      ssn: params.ssn,
      registrationNumber: params.registrationNumber,
      vtrCoverageCode: params.vtrCoverageCode,
      ...getTrialDataPlaceholders(),
    }

    console.debug(`Car Dealership debugger | Creating car trial for ${params.registrationNumber}`)
    console.table(body)

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
        errorMessage: json.errorMessage ?? 'Unknown error',
      }
    } else {
      const trialId = json.trialId!
      const jsonTrialContract = await getTrialContract(trialId, basicAuth)
      return jsonTrialContract
    }
  } catch (error) {
    console.warn('Failed to create trial', error)
    return { type: 'error', errorCode: 'UNKNOWN_ERROR', errorMessage: 'Unknown error' }
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
