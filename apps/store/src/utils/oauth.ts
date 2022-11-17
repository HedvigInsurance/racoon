export const exchangeAuthorizationCode = async (authorizationCode: string): Promise<string> => {
  const url = `${process.env.NEXT_PUBLIC_AUTH_ENDPOINT}/oauth/token`
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      authorization_code: authorizationCode,
    }),
  })
  const data = await resp.json()
  if (!resp.ok) {
    throw new Error(`Error response, status=${resp.status}`, data)
  }
  const accessToken = data.access_token
  if (!accessToken) {
    throw new Error('No access_token field in response')
  }
  return accessToken
}
