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
import type { NextCookiesStore } from '@/utils/types'

type Header = Record<string, string>

export function serverDynamicHeadersLink({ cookies }: { cookies: NextCookiesStore }) {
  return setContext(async (_, prevContext) => {
    return {
      ...prevContext,
      headers: {
        ...prevContext.headers,
        ...(await getAuthorizationHeader(cookies)),
        ...getShopSessionHeader(cookies),
      },
    }
  })
}

function getShopSessionHeader(cookies: NextCookiesStore): Header | undefined {
  const shopSessionId = getShopSessionId(cookies)
  return shopSessionId ? { 'Hedvig-ShopSessionID': shopSessionId } : undefined
}

async function getAuthorizationHeader(cookies: NextCookiesStore): Promise<Header | undefined> {
  const currentAccessToken = getAccessToken(cookies)
  if (!currentAccessToken) return

  const { exp: expiryInSeconds } = jwtDecode<JwtPayload>(currentAccessToken)
  const hasExpired = expiryInSeconds && Date.now() >= expiryInSeconds * 1000
  if (!hasExpired) return { authorization: `Bearer ${currentAccessToken}` }

  const currentRefreshToken = getRefreshToken(cookies)

  if (!currentRefreshToken) {
    console.warn('Token refresh: no refresh token found')
    resetAuthTokens(cookies)
    return
  }

  const { accessToken, refreshToken } = await refreshAccessToken(currentRefreshToken)
  saveAuthTokens({ accessToken, refreshToken, cookies })
  return { Authorization: `Bearer ${accessToken}` }
}
