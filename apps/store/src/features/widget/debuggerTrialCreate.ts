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

export const getTrialData = (body: Record<string, string | undefined>): RequestData => {
  const birthDate = body[Field.birthDate]
  const ssn = body[Field.ssn]

  return {
    requestId: Crypto.randomUUID(),
    trialData: {
      trialType: 'SWEDISH_GROUP_APARTMENT',
      [Field.firstName]: getOrThrow(body, Field.firstName),
      [Field.lastName]: getOrThrow(body, Field.lastName),
      [Field.email]: body[Field.email] || getRandomEmailAddress(),
      [Field.startDate]: getOrThrow(body, Field.startDate),
      [Field.street]: getOrThrow(body, Field.street),
      [Field.zipCode]: getOrThrow(body, Field.zipCode),
      [Field.subType]: getOrThrow(body, Field.subType),
      ...(birthDate && { [Field.birthDate]: birthDate }),
      ...(ssn && { [Field.ssn]: ssn }),
      ...(body[Field.livingSpace] && { [Field.livingSpace]: Number(body[Field.livingSpace]) }),
      ...(body[Field.numberCoInsured] && {
        [Field.numberCoInsured]: Number(body[Field.numberCoInsured]),
      }),
      ...(body[Field.isStudent] && { [Field.isStudent]: body[Field.isStudent] === 'true' }),
    },
  }
}

export const getPartner = (body: Record<string, string | undefined>): string => {
  return getOrThrow(body, Field.partner)
}

const getOrThrow = (data: Record<string, unknown>, field: string): string => {
  const value = data[field]
  if (typeof value !== 'string') throw new Error(`Missing field ${field}`)
  return value
}

const getRandomEmailAddress = () => {
  const randomId = Crypto.getRandomValues(new Uint32Array(1))[0]
  return `sven.svensson.${randomId}@hedvig.com`
}
