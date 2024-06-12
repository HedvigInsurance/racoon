import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { initTranslations } from '@/app/i18n'
import { TranslationsProvider } from '@/appComponents/providers/TranslationsProvider'
import { StoreLayout } from '@/appComponents/StoreLayout'
import { locales } from '@/utils/l10n/locales'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import type { RoutingLocale } from '@/utils/l10n/types'

export type LocalizedLayoutProps<P = unknown> = P & {
  children: ReactNode
  params: { locale: RoutingLocale }
}

export default async function LocalizedStoreLayout({
  children,
  params: { locale },
}: LocalizedLayoutProps) {
  // GOTCHA: We cannot exclude unknown locales with `dynamicParams = false` since it apparently overrides
  // `dynamicParams` in `[[...slug]]` child dir which breaks our desired CMS rendering config
  // NextJs issue: https://github.com/vercel/next.js/issues/42940
  if (!isRoutingLocale(locale)) {
    return notFound()
  }
  const { resources } = await initTranslations(locale)
  return (
    <TranslationsProvider locale={locale} resources={resources}>
      <StoreLayout locale={locale}>{children}</StoreLayout>
    </TranslationsProvider>
  )
}

export const generateStaticParams = () => {
  return Object.values(locales).map(({ routingLocale }) => ({ locale: routingLocale }))
}
