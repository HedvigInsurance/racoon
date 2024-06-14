import { type ReactNode } from 'react'
import { TranslationsProvider } from '@/appComponents/providers/TranslationsProvider'
import { RootLayout } from '@/appComponents/RootLayout/RootLayout'
import { Header } from '@/components/Header/Header'
import { FALLBACK_LOCALE } from '@/utils/l10n/locales'
import { toRoutingLocale } from '@/utils/l10n/localeUtils'
import { initTranslations } from '../i18n'

type Props = {
  children: ReactNode
}

const Layout = async ({ children }: Props) => {
  const locale = toRoutingLocale(FALLBACK_LOCALE)

  const { resources } = await initTranslations(locale, {
    ns: ['contractSwitchConfirmationForm', 'common'],
  })

  return (
    <RootLayout>
      <TranslationsProvider locale={locale} resources={resources}>
        <Header />
        <main>{children}</main>
      </TranslationsProvider>
    </RootLayout>
  )
}

export const metadata = {
  robots: 'noindex, nofollow',
}

export default Layout
