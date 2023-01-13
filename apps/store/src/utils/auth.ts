import { CookieParams, getAuthHeader } from '@/services/Auth/Auth'

enum MemberLoginMethod {
  SE_BANKID = 'SE_BANKID',
}

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_ENDPOINT
const Endpoint = {
  TOKEN: `${BASE_URL}/oauth/token`,
  MEMBER_AUTH_CODES: `${BASE_URL}/member-authorization-codes`,
  MEMBER_LOGIN: `${BASE_URL}/member-login`,
  LOGIN_STATUS: (statusUrl: string) => `${BASE_URL}${statusUrl}`,
} as const

type TokenResponse = { access_token?: string }

export const exchangeAuthorizationCode = async (authorizationCode: string): Promise<string> => {
  const { access_token: accessToken } = await fetchJson<TokenResponse>(Endpoint.TOKEN, {
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

export const createAuthorizationCode = async (params?: CookieParams) => {
  const data = await fetchJson<MemberAuthCodeResponse>(Endpoint.MEMBER_AUTH_CODES, {
    method: 'POST',
    headers: getAuthHeader(params),
  })
  return data.authorizationCode
}

type MemberLoginResponseSuccess = {
  result: 'success'
  id: string
  method: MemberLoginMethod
  statusUrl: string

  seBankIdProperties: {
    orderRef: string
    autoStartToken: string
  }
}

type MemberLoginResponseError = {
  result: 'error'
  reason: string
}

type MemberLoginResponse = MemberLoginResponseSuccess | MemberLoginResponseError

const memberLoginCreateSE = async (personalNumber: string) => {
  const data = await fetchJson<MemberLoginResponse>(Endpoint.MEMBER_LOGIN, {
    method: 'POST',
    body: JSON.stringify({
      method: MemberLoginMethod.SE_BANKID,
      personalNumber,
    }),
  })

  if (data.result === 'error') {
    throw new Error('Failed to login: ' + data.reason)
  }

  return data
}

type MemberLoginStatusResponse =
  | {
      status: 'PENDING' | 'FAILED'
      statusText: string
    }
  | {
      status: 'COMPLETED'
      authorizationCode: string
    }

const memberLoginStatus = async (statusUrl: string) => {
  return await fetchJson<MemberLoginStatusResponse>(statusUrl)
}

const memberLoginStatusPoll = async (statusUrl: string): Promise<string> => {
  const result = await memberLoginStatus(statusUrl)

  if (result.status === 'COMPLETED') {
    return result.authorizationCode
  }

  if (result.status === 'FAILED') {
    throw new Error('Login failed: ' + result.statusText)
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(memberLoginStatusPoll(statusUrl))
    }, 1000)
  })
}

export const memberLoginSE = async (ssn: string) => {
  const { statusUrl } = await memberLoginCreateSE(ssn)
  const authorizationCode = await memberLoginStatusPoll(Endpoint.LOGIN_STATUS(statusUrl))
  return await exchangeAuthorizationCode(authorizationCode)
}

const fetchJson = async <T extends object>(
  url: string,
  options?: Partial<RequestInit>,
): Promise<T> => {
  const resp = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  })
  const data = await resp.json()
  if (!resp.ok) {
    throw new Error(`Error response, status=${resp.status}`, data)
  }
  return data
}
