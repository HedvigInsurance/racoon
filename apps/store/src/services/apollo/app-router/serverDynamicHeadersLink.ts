import { setContext } from '@apollo/client/link/context'
import { jwtDecode, type JwtPayload } from 'jwt-decode'
import {
  getAccessToken,
  getRefreshToken,
  resetAuthTokens,
  saveAuthTokens,
} from '@/services/authApi/app-router/persist'
import { refreshAccessToken } from '@/services/authApi/oauth'
import { getShopSessionId } from '@/services/shopSession/app-router/ShopSession.utils'

type Header = Record<string, string>

export function serverDynamicHeadersLink() {
  return setContext(async (_, prevContext) => {
    return {
      ...prevContext,
      headers: {
        ...prevContext.headers,
        ...(await getAuthorizationHeader()),
        ...getShopSessionHeader(),
      },
    }
  })
}

function getShopSessionHeader(): Header | undefined {
  const shopSessionId = getShopSessionId()
  return shopSessionId ? { 'Hedvig-ShopSessionID': shopSessionId } : undefined
}

async function getAuthorizationHeader(): Promise<Header | undefined> {
  const currentAccessToken = getAccessToken()
  if (!currentAccessToken) return

  const { exp: expiryInSeconds } = jwtDecode<JwtPayload>(currentAccessToken)
  const hasExpired = expiryInSeconds && Date.now() >= expiryInSeconds * 1000
  if (!hasExpired) return { authorization: `Bearer ${currentAccessToken}` }

  const currentRefreshToken = getRefreshToken()

  if (!currentRefreshToken) {
    console.warn('Token refresh: no refresh token found')
    resetAuthTokens()
    return
  }

  const { accessToken, refreshToken } = await refreshAccessToken(currentRefreshToken)
  saveAuthTokens({ accessToken, refreshToken })
  return { Authorization: `Bearer ${accessToken}` }
}
