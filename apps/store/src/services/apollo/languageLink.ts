import { setContext } from '@apollo/client/link/context'
import { i18n } from 'next-i18next'
import { isBrowser } from '@/utils/env'
import { getLocaleOrFallback, toIsoLocale } from '@/utils/l10n/localeUtils'
import { type RoutingLocale } from '@/utils/l10n/types'

export const languageLink = setContext((_, { headers = {}, ...context }) => {
  if (!isBrowser()) return context

  const locale = getLocaleOrFallback(i18n?.language).routingLocale
  return {
    headers: {
      ...headers,
      ...getHedvigLanguageHeader(locale),
    },
    ...context,
  }
})

const getHedvigLanguageHeader = (locale: RoutingLocale) => ({
  'hedvig-language': toIsoLocale(locale),
})
