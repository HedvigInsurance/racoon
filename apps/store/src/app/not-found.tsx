import { TranslationsProvider } from '@/appComponents/providers/TranslationsProvider'
import { NotFoundPageContent } from '@/appComponents/RootLayout/NotFoundPageContent'
import { StoreLayout } from '@/appComponents/StoreLayout'
import { FALLBACK_LOCALE } from '@/utils/l10n/locales' // Fallback to se/not-found
import { toRoutingLocale } from '@/utils/l10n/localeUtils'

// Global fallback, has to be located at the top of app dir
// Hence manual import and usage of layout
// We're doing locale-specific 404s at [locale]/not-found
export default function RootNotFoundPage() {
  const locale = toRoutingLocale(FALLBACK_LOCALE)
  // Optimization: not providing translations and telling UI to preload common namespace from the cient
  // Global not-found is included in every page bundle, so this is important
  return (
    <TranslationsProvider locale={locale} resources={undefined} ns={['common']}>
      <StoreLayout locale={locale}>
        <NotFoundPageContent />
      </StoreLayout>
    </TranslationsProvider>
  )
}
