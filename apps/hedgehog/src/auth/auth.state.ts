import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { AuthResponse } from './auth.api'
import { BACKOFFICE_BASE_URL } from 'backoffice/backoffice.api'

// Next will complain if used directly
import { cookies } from 'next/headers'

export type NextCookies = typeof cookies

export const AUTH_KEYS = {
  ACCESS_TOKEN: '_hvg_at',
  REFRESH_TOKEN: '_hvg_rt',
  ACCESS_TOKEN_EXPIRES_AT: '_hvg_exp',
}

export const authState = (cookies?: NextCookies) => ({
  accessToken:
    getCookie(AUTH_KEYS.ACCESS_TOKEN, {
      cookies,
    }) ?? undefined,
  refreshToken:
    getCookie(AUTH_KEYS.REFRESH_TOKEN, {
      cookies,
    }) ?? undefined,
  accessTokenExpiresAt:
    getCookie(AUTH_KEYS.ACCESS_TOKEN_EXPIRES_AT, {
      cookies,
    }) ?? undefined,
})

export const removeAccessToken = () => {
  deleteCookie(AUTH_KEYS.ACCESS_TOKEN)
}

export const removeRefreshToken = () => {
  deleteCookie(AUTH_KEYS.REFRESH_TOKEN)
}

export const removeExpiryToken = () => {
  deleteCookie(AUTH_KEYS.ACCESS_TOKEN_EXPIRES_AT)
}

export const removeAuthTokens = () => {
  removeAccessToken()
  removeRefreshToken()
  removeExpiryToken()
}

export const saveAuthTokens = async (tokens: AuthResponse) => {
  saveAccessToken(tokens.access_token)
  saveRefreshToken(tokens.refresh_token)
  saveExpiryToken(tokens.expires_in)

  await transferAccessTokenToBackofficeCookie(tokens.access_token)
}

const saveAccessToken = (token: string) => {
  setCookie(AUTH_KEYS.ACCESS_TOKEN, token, {
    secure: true,
    sameSite: 'strict',
  })
}

const saveRefreshToken = (token: string) => {
  setCookie(AUTH_KEYS.REFRESH_TOKEN, token, {
    secure: true,
    sameSite: 'strict',
  })
}

const saveExpiryToken = (expiresInSeconds: number) => {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + expiresInSeconds * 1000)

  setCookie(AUTH_KEYS.ACCESS_TOKEN_EXPIRES_AT, expiresAt.getTime().toString(), {
    secure: true,
    sameSite: 'strict',
  })
}

/**
 * This trick is used so that the backoffice domain has the auth
 * token as its cookie. We want that to be able to read files from backoffice,
 * but also protect those file endpoints using our regular auth tokens.
 *
 * It's not beautiful, but it is what we have now.
 */
const transferAccessTokenToBackofficeCookie = async (token: string) => {
  try {
    await fetch(`${BACKOFFICE_BASE_URL}/token-cookie-exchange`, {
      method: 'POST',
      credentials: 'include',
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (e) {
    console.log(e)
  }
}
