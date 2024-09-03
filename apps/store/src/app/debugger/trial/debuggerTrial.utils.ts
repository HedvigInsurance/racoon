import Crypto from 'crypto'
import { Field } from './debuggerTrial.types'

type RequestData = {
  requestId: string
  trialData: {
    trialType: 'SWEDISH_GROUP_APARTMENT'
    [Field.firstName]: string
    [Field.lastName]: string
    [Field.email]: string
    [Field.startDate]: string
    [Field.street]: string
    [Field.zipCode]: string
    [Field.subType]: string
    [Field.birthDate]?: string
    [Field.ssn]?: string
    [Field.livingSpace]?: number
    [Field.numberCoInsured]?: number
    [Field.isStudent]?: boolean
  }
}

type ResponseData = {
  externalMemberId: string
  fullUrl: string
}
type ErrorResponseData = { errorCode: string; errorMessage: string }

const ENDPOINT = 'https://extapi.dev.hedvigit.com/v1/trials'
export const createTrial = async (partner: string, data: RequestData): Promise<ResponseData> => {
  const username = process.env[`RAPIO_USERNAME_${partner}`]
  if (!username) throw new Error(`Missing username for partner: ${partner}`)

  const basicAuth = Buffer.from(`${username}:`).toString('base64')
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': 'sv-SE',
      Authorization: `Basic ${basicAuth}`,
    },
  })

  if (!response.ok) {
    const text = await response.text()
    console.warn('Failed to create trial', text)
    console.warn('Request headers', response.headers)
    console.warn('Request data', data)
    console.warn('Response status', response.status)

    const json = JSON.parse(text) as ErrorResponseData
    throw new Error(`${json.errorCode}: ${json.errorMessage}`)
  }

  return (await response.json()) as ResponseData
}

export const getTrialData = (formData: FormData): RequestData => {
  const birthDate = formData.get(Field.birthDate) as string
  const ssn = formData.get(Field.ssn) as string

  return {
    requestId: Crypto.randomUUID(),
    trialData: {
      trialType: 'SWEDISH_GROUP_APARTMENT',
      [Field.firstName]: getOrThrow(formData, Field.firstName),
      [Field.lastName]: getOrThrow(formData, Field.lastName),
      [Field.email]: (formData.get(Field.email) as string) || getRandomEmailAddress(),
      [Field.startDate]: getOrThrow(formData, Field.startDate),
      [Field.street]: getOrThrow(formData, Field.street),
      [Field.zipCode]: getOrThrow(formData, Field.zipCode),
      [Field.subType]: getOrThrow(formData, Field.subType),
      ...(birthDate && { [Field.birthDate]: birthDate }),
      ...(ssn && { [Field.ssn]: ssn }),
      ...(formData.get(Field.livingSpace) && {
        [Field.livingSpace]: Number(formData.get(Field.livingSpace)),
      }),
      ...(formData.get(Field.numberCoInsured) && {
        [Field.numberCoInsured]: Number(formData.get(Field.numberCoInsured)),
      }),
      ...(formData.get(Field.isStudent) && {
        [Field.isStudent]: formData.get(Field.isStudent) === 'true',
      }),
    },
  }
}

export const getPartner = (formData: FormData): string => {
  return getOrThrow(formData, Field.partner)
}

// TODO: use getFormValueOrThrow
const getOrThrow = (formData: FormData, field: string): string => {
  const value = formData.get(field)
  if (typeof value !== 'string') throw new Error(`Missing field ${field}`)
  return value
}

const getRandomEmailAddress = () => {
  const randomId = Crypto.getRandomValues(new Uint32Array(1))[0]
  return `sven.svensson.${randomId}@hedvig.com`
}
