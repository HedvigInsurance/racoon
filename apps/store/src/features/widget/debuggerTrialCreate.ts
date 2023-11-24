import Crypto from 'crypto'
import { ORIGIN_URL } from '@/utils/PageLink'
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
  }
}

type ResponseData = { externalMemberId: string }

const ENDPOINT = 'https://extapi.dev.hedvigit.com/v1/trials'
export const createTrial = async (data: RequestData): Promise<string> => {
  const basicAuth = Buffer.from(`${process.env.RAPIO_USERNAME}:`).toString('base64')
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
    console.warn('Failed to create trial', await response.text())
    console.warn('Request headers', response.headers)
    console.warn('Request data', data)
    console.warn('Response status', response.status)
    console.warn('Response status text', response.statusText)
    console.warn('Response data', await response.json())
    throw new Error(response.statusText)
  }

  const json = (await response.json()) as ResponseData
  return json.externalMemberId
}

export const getTrialData = (body: Record<string, string | undefined>): RequestData => {
  const birthDate = body[Field.birthDate]

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
    },
  }
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

const WIDGET_AVY_URL = '/se/widget/flows/avy'
export const getAvyWidgetUrl = (externalMemberId: string): URL => {
  const url = new URL(WIDGET_AVY_URL, ORIGIN_URL)
  url.searchParams.set('externalMemberId', externalMemberId)
  return url
}
