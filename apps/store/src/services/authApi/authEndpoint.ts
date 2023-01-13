const BASE_URL = process.env.NEXT_PUBLIC_AUTH_ENDPOINT

export const AuthEndpoint = {
  TOKEN: `${BASE_URL}/oauth/token`,
  MEMBER_AUTH_CODES: `${BASE_URL}/member-authorization-codes`,
  MEMBER_LOGIN: `${BASE_URL}/member-login`,
  LOGIN_STATUS: (statusUrl: string) => `${BASE_URL}${statusUrl}`,
} as const
