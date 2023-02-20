import { AuthEndpoint } from './authEndpoint'
import { fetchJson } from './fetchJson'

type TokenResponse = {
  token_type: 'Bearer'
  access_token: string
  refresh_token: string
  expires_in: number
  refresh_token_expires_in: number
}

export const exchangeAuthorizationCode = async (authorizationCode: string) => {
  const result = await fetchJson<TokenResponse>(AuthEndpoint.TOKEN, {
    method: 'POST',
    body: JSON.stringify({
      grant_type: 'authorization_code',
      authorization_code: authorizationCode,
    }),
  })
  return {
    accessToken: result.access_token,
    refreshToken: result.refresh_token,
  }
}

type MemberAuthCodeResponse = { authorizationCode: string }

export const createAuthorizationCode = async (authHeaders: HeadersInit) => {
  const data = await fetchJson<MemberAuthCodeResponse>(AuthEndpoint.MEMBER_AUTH_CODES, {
    method: 'POST',
    headers: authHeaders,
  })
  return data.authorizationCode
}

export const refreshAccessToken = async (refreshToken: string) => {
  const result = await fetchJson<TokenResponse>(AuthEndpoint.TOKEN, {
    method: 'POST',
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })
  if (!result.access_token) {
    throw new Error('No access_token field in response')
  }

  return {
    accessToken: result.access_token,
    refreshToken: result.refresh_token,
  }
}
