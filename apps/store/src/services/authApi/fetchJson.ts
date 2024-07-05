import { FALLBACK_LOCALE } from '@/utils/l10n/locales'
import { toIsoLocale } from '@/utils/l10n/localeUtils'
import type { RoutingLocale } from '@/utils/l10n/types'

export const fetchJson = async <T extends object>(
  url: string,
  options?: { locale?: RoutingLocale } & Partial<RequestInit>,
): Promise<T> => {
  const { locale, ...requestOptions } = options ?? {}

  const resp = await fetch(url, {
    ...requestOptions,
    headers: {
      'Content-type': 'application/json',
      'Hedvig-Language': toIsoLocale(locale ?? FALLBACK_LOCALE),
      ...options?.headers,
    },
  })
  const data = (await resp.json()) as T
  if (!resp.ok) {
    throw new ServerError(`Error response, status=${resp.status}`, data)
  }
  return data
}

export class ServerError extends Error {
  constructor(
    message: string,
    public data: any,
  ) {
    super(message)
  }
}
