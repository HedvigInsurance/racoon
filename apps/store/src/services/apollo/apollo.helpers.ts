import jwtDecode, { JwtPayload } from 'jwt-decode'
import { refreshAccessToken } from '@/services/authApi/oauth'
import {
  CookieParams,
  getAccessToken,
  getRefreshToken,
  resetAuthTokens,
  saveAuthTokens,
} from '@/services/authApi/persist'

export const performTokenRefreshIfNeeded = async (cookieParams?: CookieParams) => {
  const currentAccessToken = getAccessToken(cookieParams)

  if (!currentAccessToken) return

  const { exp: expiryInSeconds } = jwtDecode<JwtPayload>(currentAccessToken)
  const hasExpired = expiryInSeconds && Date.now() >= expiryInSeconds * 1000

  if (!hasExpired) return { authorization: `Bearer ${currentAccessToken}` }

  const currentRefreshToken = getRefreshToken(cookieParams)

  if (!currentRefreshToken) {
    console.error('Token refresh: no refresh token found')
    resetAuthTokens(cookieParams)
    return
  }

  const { accessToken, refreshToken } = await refreshAccessToken(currentRefreshToken)

  saveAuthTokens({ accessToken, refreshToken, ...cookieParams })

  return { authorization: `Bearer ${accessToken}` }
}
