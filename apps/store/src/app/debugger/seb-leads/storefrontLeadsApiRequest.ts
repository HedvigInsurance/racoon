import { getEnvOrThrow } from '@/utils/getEnvOrThrow'

export const storefrontLeadsApiRequest = async <T>(
  path: string,
  requestInit: RequestInit,
): Promise<T> => {
  const headers = new Headers()
  headers.set(
    'Authorization',
    'Basic ' +
      Buffer.from(
        `${getEnvOrThrow('SEB_LEADS_STOREFRONT_API_USERNAME')}:${getEnvOrThrow('SEB_LEADS_STOREFRONT_API_PASSWORD')}`,
        'utf-8',
      ).toString('base64'),
  )
  const url = `${getEnvOrThrow('SEB_LEADS_STOREFRONT_API_URL')}${path}`
  const response = await fetch(url, { ...requestInit, headers })
  const result = (await response.json()) as T
  console.debug('API response', result)
  if (!response.ok) {
    const { status, error } = result as any
    throw new Error(`${status}: ${error ?? 'Unknown error'}`)
  }
  return result
}
