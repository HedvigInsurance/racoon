import { setContext } from '@apollo/client/link/context'
import { jwtDecode, type JwtPayload } from 'jwt-decode'
import { headers } from 'next/headers'
import {
  getAccessToken,
  getRefreshToken,
  resetAuthTokens,
  saveAuthTokens,
} from '@/services/authApi/app-router/persist'
import { refreshAccessToken } from '@/services/authApi/oauth'
import { getShopSessionId } from '@/services/shopSession/app-router/ShopSession.utils'
import { getUrlLocale, toIsoLocale } from '@/utils/l10n/localeUtils'
import { type RoutingLocale } from '@/utils/l10n/types'

export const headersLink = setContext(async (_, prevContext) => {
  return {
    ...prevContext,
    headers: {
      ...prevContext.headers,

      ...(await performTokenRefreshIfNeeded()),
      ...getHedvigLanguageHeader(),
      ...getShopSessionHeader(),
    },
  }
})

const getHedvigLanguageHeader = (): Record<string, string> => {
  const headerList = headers()
  const url = headerList.get('x-invoke-path')

  let locale: RoutingLocale = 'se'
  if (url) {
    locale = getUrlLocale(url)
  }

  return { 'Hedvig-Language': toIsoLocale(locale) }
}

const getShopSessionHeader = (): Record<string, string> | undefined => {
  const shopSessionId = getShopSessionId()
  return shopSessionId ? { 'Hedvig-ShopSessionID': shopSessionId } : undefined
}

const performTokenRefreshIfNeeded = async (): Promise<Record<string, string> | undefined> => {
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
