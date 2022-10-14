import { getCookie, setCookie } from 'cookies-next'
import { OptionsType } from 'cookies-next/lib/types'
import { v4 as uuidv4 } from 'uuid'

const DEVICE_ID_COOKIE_KEY = '_hv_device_id'
const MAX_AGE = 10 * 365 * 24 * 60 * 60 // 10 years

type Params = Pick<OptionsType, 'req' | 'res'>

const getOrCreateDeviceId = ({ req, res }: Params) => {
  const currentDeviceId = getDeviceId({ req, res })
  if (currentDeviceId) return currentDeviceId

  const newDeviceId = uuidv4()
  setCookie(DEVICE_ID_COOKIE_KEY, newDeviceId, { req, res, maxAge: MAX_AGE })
  return newDeviceId
}

const getDeviceId = ({ req, res }: Params) => {
  const value = getCookie(DEVICE_ID_COOKIE_KEY, { req, res })
  return typeof value === 'string' ? value : undefined
}

export const getDeviceIdHeader = (params: Params) => {
  return {
    'hedvig-device-id': getOrCreateDeviceId(params),
  }
}
