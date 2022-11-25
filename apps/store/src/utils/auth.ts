import { CookieParams, getAuthHeader } from '@/services/Auth/Auth'

export const exchangeAuthorizationCode = async (authorizationCode: string): Promise<string> => {
  const url = `${process.env.NEXT_PUBLIC_AUTH_ENDPOINT}/oauth/token`
  const data = await fetchJson<{ access_token: string }>(url, {
    method: 'POST',
    body: JSON.stringify({
      grant_type: 'authorization_code',
      authorization_code: authorizationCode,
    }),
  })
  const accessToken = data.access_token
  if (!accessToken) {
    throw new Error('No access_token field in response')
  }
  return accessToken
}

export const createAuthorizationCode = async (params?: CookieParams) => {
  const url = `${process.env.NEXT_PUBLIC_AUTH_ENDPOINT}/member-authorization-codes`
  const data = await fetchJson<{ authorizationCode: string }>(url, {
    method: 'POST',
    headers: {
      ...getAuthHeader(params),
    },
  })
  return data.authorizationCode
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
