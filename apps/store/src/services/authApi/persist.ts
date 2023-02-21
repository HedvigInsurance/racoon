import { getCookie, setCookie, deleteCookie } from 'cookies-next'
import { OptionsType } from 'cookies-next/lib/types'
import { CookieParams } from '@/utils/types'

const COOKIE_KEY = '_hvsession'
const REFRESH_TOKEN_COOKIE_KEY = '_hvrefresh'
const ACCESS_TOKEN_SESSION_FIELD = 'token'
const MAX_AGE = 60 * 60 * 24 // 24 hours

const OPTIONS: OptionsType = {
  maxAge: MAX_AGE,
  path: '/',
  ...(process.env.NODE_ENV === 'production' && {
    secure: true,
  }),
}

type SaveAuthTokensParams = CookieParams & {
  accessToken: string
  refreshToken: string
}

export const saveAuthTokens = (params: SaveAuthTokensParams) => {
  const { accessToken, refreshToken, ...cookieParams } = params
  setCookie(COOKIE_KEY, serialize(accessToken), { ...cookieParams, ...OPTIONS })
  setCookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, { ...cookieParams, ...OPTIONS })
}

export const resetAuthTokens = (cookieParams: CookieParams = {}) => {
  deleteCookie(COOKIE_KEY, { ...cookieParams, ...OPTIONS })
  deleteCookie(REFRESH_TOKEN_COOKIE_KEY, { ...cookieParams, ...OPTIONS })
}

export const getRefreshToken = (cookieParams: CookieParams = {}) => {
  const cookieValue = getCookie(REFRESH_TOKEN_COOKIE_KEY, cookieParams)
  if (typeof cookieValue === 'string') return cookieValue
}

export const getAccessToken = (cookieParams: CookieParams = {}) => {
  const cookieValue = getCookie(COOKIE_KEY, cookieParams)
  if (typeof cookieValue !== 'string') return undefined
  return deserialize(cookieValue)
}

export const getAuthHeaders = (params: CookieParams = {}): Record<string, string> => {
  const accessToken = getAccessToken(params)
  if (accessToken) return { authorization: `Bearer ${accessToken}` }
  return {}
}

const serialize = (accessToken: string) => {
  return JSON.stringify({ [ACCESS_TOKEN_SESSION_FIELD]: accessToken })
}

const deserialize = (value: string) => {
  try {
    const data = JSON.parse(value)
    const accessToken = data[ACCESS_TOKEN_SESSION_FIELD]
    return typeof accessToken === 'string' ? accessToken : undefined
  } catch (error) {
    console.warn('Unable to deserialize session')
    return undefined
  }
}
