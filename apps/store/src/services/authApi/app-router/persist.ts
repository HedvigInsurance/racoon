import { type OptionsType } from 'cookies-next/lib/types'
import { cookies } from 'next/headers'

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

type SaveAuthTokensParams = {
  accessToken: string
  refreshToken: string
}

export const saveAuthTokens = ({ accessToken, refreshToken }: SaveAuthTokensParams) => {
  const cookieStore = cookies()
  cookieStore.set(COOKIE_KEY, serialize(accessToken), OPTIONS)
  cookieStore.set(REFRESH_TOKEN_COOKIE_KEY, refreshToken, OPTIONS)
}

export const resetAuthTokens = () => {
  const cookieStore = cookies()
  cookieStore.delete(COOKIE_KEY)
  cookieStore.delete(REFRESH_TOKEN_COOKIE_KEY)
}

export const getRefreshToken = (): string | undefined => {
  return cookies().get(REFRESH_TOKEN_COOKIE_KEY)?.value
}

export const getAccessToken = (): string | undefined => {
  const cookieValue = cookies().get(COOKIE_KEY)?.value
  return cookieValue ? deserialize(cookieValue) : undefined
}

export const getAuthHeaders = (): Record<string, string> => {
  const accessToken = getAccessToken()
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
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
