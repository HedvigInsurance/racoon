import { FALLBACK_LOCALE } from '@/utils/l10n/locales'
import { toRoutingLocale } from '@/utils/l10n/localeUtils'
import LocaleLayout from './[locale]/layout'
import { NotFoundPageContent } from './[locale]/NotFoundPageContent' // Fallback to se/not-found

// Global fallback, has to be located at the top of app dir
// Hence manual import and usage of layout
// We're doing locale-specific 404s at [locale]/not-found
export default function NotFound() {
  return (
    <LocaleLayout params={{ locale: toRoutingLocale(FALLBACK_LOCALE) }}>
      <NotFoundPageContent />
    </LocaleLayout>
  )
}
