import { getAuthCredentials } from 'auth/auth.api'

export const BACKOFFICE_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const attachAuthHeader = async () => {
  const { accessToken } = await getAuthCredentials()

  return {
    Authorization: `Bearer ${accessToken}`,
  }
}
