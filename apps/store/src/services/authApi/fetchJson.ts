import { i18n } from 'next-i18next'
import { getLocaleOrFallback, toIsoLocale } from '@/utils/l10n/localeUtils'
import type { UiLocale } from '@/utils/l10n/types'

export const fetchJson = async <T extends object>(
  url: string,
  options?: Partial<RequestInit>,
): Promise<T> => {
  const locale = getLocaleOrFallback(i18n?.language as UiLocale).routingLocale

  const resp = await fetch(url, {
    ...options,
    headers: {
      'Content-type': 'application/json',
      'Hedvig-Language': toIsoLocale(locale),
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
