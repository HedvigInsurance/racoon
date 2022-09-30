import { getCookie, setCookie } from 'cookies-next'
import { GetServerSidePropsContext } from 'next'

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

export const getAccessToken = (
  req?: GetServerSidePropsContext['req'],
  res?: GetServerSidePropsContext['res'],
) => {
  const value = getCookie(AUTH_COOKIE_KEY, { req, res })
  return typeof value === 'string' ? value : undefined
}
