import jwtDecode, { JwtPayload } from 'jwt-decode'
import { refreshAccessToken } from '@/services/authApi/oauth'
import {
  getAccessToken,
  getRefreshToken,
  resetAuthTokens,
  saveAuthTokens,
} from '@/services/authApi/persist'
import { getShopSessionId } from '@/services/shopSession/ShopSession.helpers'
import { CookieParams } from '@/utils/types'

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

export const getShopSessionHeader = (cookieParams?: CookieParams) => {
  const shopSessionId = getShopSessionId(cookieParams)
  if (shopSessionId) return { 'Hedvig-ShopSessionID': shopSessionId }
  return undefined
}
