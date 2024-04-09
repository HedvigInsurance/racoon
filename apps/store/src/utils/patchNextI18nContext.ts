import type { GetStaticPropsContext } from 'next'
import { FALLBACK_LOCALE, locales } from '@/utils/l10n/locales'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

// Emulate context properties for i18n routing nextjs provides for pages dir
// Since it breaks app dir migration, we need to disable built-in mechanism and replace with our own
// Related issues:
// https://github.com/vercel/next.js/issues/57704
// https://github.com/i18next/next-i18next/issues/2221
export const patchNextI18nContext = (context: GetStaticPropsContext) => {
  if (context.locale != null) {
    throw new Error('context.locale must be empty, check if i18n has been enabled in nextjs config')
  }
  const { locale } = context.params ?? {}
  if (!isRoutingLocale(locale)) {
    console.warn(`Invalid params.locale = ${locale}`)
  }
  context.locale = String(locale)
  context.defaultLocale = locales[FALLBACK_LOCALE].routingLocale
}
