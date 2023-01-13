import { getCookie, setCookie, deleteCookie } from 'cookies-next'
import { OptionsType } from 'cookies-next/lib/types'
import { PageLink } from '@/utils/PageLink'

const COOKIE_KEY = '_hvsession'
const ACCESS_TOKEN_SESSION_FIELD = 'token'
const MAX_AGE = 60 * 60 * 24 // 24 hours

const OPTIONS: OptionsType = {
  maxAge: MAX_AGE,
  path: '/',
  ...(process.env.NODE_ENV === 'production' && {
    secure: true,
  }),
}

export const save = (accessToken: string, { req, res }: CookieParams = {}) => {
  setCookie(COOKIE_KEY, serialize(accessToken), { req, res, ...OPTIONS })
}

export type CookieParams = Pick<OptionsType, 'req' | 'res'>

export const reset = ({ req, res }: CookieParams) => {
  deleteCookie(COOKIE_KEY, { req, res, ...OPTIONS })
}

const getAccessToken = ({ req, res }: CookieParams) => {
  const cookieValue = getCookie(COOKIE_KEY, { req, res })
  if (typeof cookieValue !== 'string') return undefined
  return deserialize(cookieValue)
}

export const getAuthHeader = (params: CookieParams = {}): Record<string, string> => {
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

type LoginSEOptions = Partial<{ nextUrl: string }>

export const loginSE = async (ssn: string, { nextUrl }: LoginSEOptions = {}) => {
  const response = await fetch(PageLink.apiLoginSe(), {
    method: 'POST',
    body: JSON.stringify({ ssn, nextUrl }),
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error('Unable to login')
  }
}
