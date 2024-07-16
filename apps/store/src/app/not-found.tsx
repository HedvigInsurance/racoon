import { initTranslations } from '@/app/i18n'
import { TranslationsProvider } from '@/appComponents/providers/TranslationsProvider'
import { NotFoundPageContent } from '@/appComponents/RootLayout/NotFoundPageContent'
import { RootLayout } from '@/appComponents/RootLayout/RootLayout'
import { FALLBACK_LOCALE } from '@/utils/l10n/locales' // Fallback to se/not-found
import { toRoutingLocale } from '@/utils/l10n/localeUtils'

// Global fallback, has to be located at the top of app dir
// Hence manual import and usage of layout
// We're doing locale-specific 404s at [locale]/not-found
export default async function RootNotFoundPage() {
  const locale = toRoutingLocale(FALLBACK_LOCALE)
  // Only loading common namespace since this page's React tree is added to every normal page - size matters
  const { resources } = await initTranslations(locale, { ns: ['common'] })
  return (
    <RootLayout locale={locale}>
      <TranslationsProvider locale={locale} resources={resources}>
        <NotFoundPageContent />
      </TranslationsProvider>
    </RootLayout>
  )
}
