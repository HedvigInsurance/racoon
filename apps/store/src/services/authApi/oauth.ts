import { AuthEndpoint } from './authEndpoint'
import { fetchJson } from './fetchJson'

type TokenResponse = { access_token?: string }

export const exchangeAuthorizationCode = async (authorizationCode: string): Promise<string> => {
  const { access_token: accessToken } = await fetchJson<TokenResponse>(AuthEndpoint.TOKEN, {
    method: 'POST',
    body: JSON.stringify({
      grant_type: 'authorization_code',
      authorization_code: authorizationCode,
    }),
  })
  if (!accessToken) {
    throw new Error('No access_token field in response')
  }
  return accessToken
}

type MemberAuthCodeResponse = { authorizationCode: string }

export const createAuthorizationCode = async (authHeaders: HeadersInit) => {
  const data = await fetchJson<MemberAuthCodeResponse>(AuthEndpoint.MEMBER_AUTH_CODES, {
    method: 'POST',
    headers: authHeaders,
  })
  return data.authorizationCode
}
