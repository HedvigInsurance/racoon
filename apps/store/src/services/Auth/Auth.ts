import { getCookie, setCookie } from 'cookies-next'
import { OptionsType } from 'cookies-next/lib/types'
import { ORIGIN_URL } from '@/utils/PageLink'

const COOKIE_KEY = '_hvsession'
const ACCESS_TOKEN_SESSION_FIELD = 'token'
const MAX_AGE = 60 * 60 * 24 // 24 hours

export const save = (accessToken: string) => {
  console.debug('saveToken', accessToken, getRootDomain())
  setCookie(COOKIE_KEY, serialize(accessToken), {
    maxAge: MAX_AGE,
    path: '/',
    domain: getRootDomain(),
    ...(process.env.NODE_ENV === 'production' && {
      sameSite: 'none',
      secure: true,
    }),
  })
}

const getRootDomain = () => {
  const parts = new URL(ORIGIN_URL).hostname.split('.')
  const rootDomainParts = parts.slice(-2)
  return rootDomainParts.join('.')
}

type CookieParams = Pick<OptionsType, 'req' | 'res'>

const getAccessToken = ({ req, res }: CookieParams) => {
  const cookieValue = getCookie(COOKIE_KEY, { req, res })
  if (cookieValue !== 'string') return undefined
  return deserialize(cookieValue)
}

export const getAuthHeader = (params: CookieParams = {}): Record<string, string> => {
  const accessToken = getAccessToken(params)
  if (accessToken) return { authorization: accessToken }
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
