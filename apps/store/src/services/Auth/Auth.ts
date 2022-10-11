import { getCookie, setCookie } from 'cookies-next'
import { OptionsType } from 'cookies-next/lib/types'

const AUTH_COOKIE_KEY = 'HEDVIG_ACCESS_TOKEN'
const MAX_AGE = 60 * 60 * 24 // 24 hours

export const save = (accessToken: string) => {
  setCookie(AUTH_COOKIE_KEY, accessToken, {
    maxAge: MAX_AGE,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
}

type CookieParams = Pick<OptionsType, 'req' | 'res'>

const getAccessToken = ({ req, res }: CookieParams) => {
  const value = getCookie(AUTH_COOKIE_KEY, { req, res })
  return typeof value === 'string' ? value : undefined
}

export const getAuthHeader = (params: CookieParams = {}): Record<string, string> => {
  const accessToken = getAccessToken(params)
  if (accessToken) return { authorization: accessToken }
  return {}
}
