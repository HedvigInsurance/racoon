import Crypto from 'crypto'

const API_ENDPOINT = `${process.env.RAPIO_API_BASE_URL}/car-dealership/trial`

export type ValidateCarTrialParams = {
  registrationNumber: string
  ssn: string
  dealerId: string
  vtrCoverageCode: string
}

type ResponseData = { errorCode: string | null; errorMessage: string | null }
type ErrorData = { message: string; error: string }

export const validateCarDealershipTrial = async (params: ValidateCarTrialParams) => {
  console.debug(
    `Car Dealership | Validate trial for ${params.registrationNumber} (${params.dealerId})`,
  )
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

  try {
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
      return { code: json.errorCode, message: json.errorMessage ?? 'Oväntat fel' }
    }
  } catch (error) {
    console.warn('Failed to validate trial', error)
    return { code: 'UNKNOWN_ERROR', message: 'Oväntat fel' }
  }

  return null
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