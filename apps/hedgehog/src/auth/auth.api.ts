import {
  getItemWithExpiry,
  setItemWithExpiry,
} from 'utils/localstorage.helpers'
import { authState, NextCookies, saveAuthTokens } from './auth.state'

export const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_HOST
const ONE_MINUTE = 60 * 1000

export type AuthResponse = {
  access_token: string
  refresh_token: string
  expires_in: number
}

export const grantWithAuthorizationCode = async (
  authorizationCode: string,
): Promise<AuthResponse> => {
  const response = await fetch(`${AUTH_BASE_URL}/oauth/token`, {
    method: 'POST',
    body: JSON.stringify({
      grant_type: 'authorization_code',
      authorization_code: authorizationCode,
    }),
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  const body = await response.json()

  if (!response.ok) {
    console.error(body)
    throw new Error(
      JSON.stringify({
        body,
        clientMessage: 'Failed to grant access with authorizationcode',
      }),
    )
  }
  return body as AuthResponse
}

export const grantWithRefreshToken = async (
  refreshToken: string,
): Promise<AuthResponse> => {
  const response = await fetch(`${AUTH_BASE_URL}/oauth/token`, {
    method: 'POST',
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  const body = await response.json()

  if (!response.ok) {
    console.error(body)
    throw new Error('refresh_token_error:failed')
  }

  return body as AuthResponse
}

export const getAuthCredentials = async (
  cookies?: NextCookies,
): Promise<{
  accessToken: string | undefined
}> => {
  const { accessToken, accessTokenExpiresAt } = authState(cookies)

  const now = new Date().getTime()
  const shouldRefresh =
    !accessTokenExpiresAt || parseInt(accessTokenExpiresAt) - now < ONE_MINUTE

  if (accessToken && !shouldRefresh) {
    return {
      accessToken,
    }
  }

  const result = await attemptRefresh()
  switch (result.type) {
    case 'refreshed':
      return result
    case 'ongoing':
      // A refresh attempt is already ongoing. Let's use the existing
      // AT a little longer, as it likely still works.
      return { accessToken }
    case 'failed':
      console.warn(result.error)
      return { accessToken: undefined }
  }
}

type RefreshAttemptResult =
  | {
      type: 'refreshed'
      accessToken: string
    }
  | {
      type: 'ongoing'
    }
  | {
      type: 'failed'
      error: string | Error
    }

const attemptRefresh = async (): Promise<RefreshAttemptResult> => {
  if (getItemWithExpiry('hvg:refreshingAccessToken') === 'true') {
    // bail if we're already refreshing
    return { type: 'ongoing' }
  }

  const { refreshToken } = authState()
  if (!refreshToken) {
    return {
      type: 'failed',
      error: 'refresh_token_error:missing',
    }
  }

  try {
    setItemWithExpiry('hvg:refreshingAccessToken', 'true', 10000)
    const authResponse = await grantWithRefreshToken(refreshToken)
    await saveAuthTokens(authResponse)
    return {
      type: 'refreshed',
      accessToken: authResponse.access_token,
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        type: 'failed',
        error: error,
      }
    } else {
      throw error
    }
  } finally {
    localStorage.removeItem('hvg:refreshingAccessToken')
  }
}
