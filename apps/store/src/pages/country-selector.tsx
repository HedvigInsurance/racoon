import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { CountrySelectorPage } from '@/components/CountrySelectorPage/CountrySelectorPage'
import { FALLBACK_LOCALE } from '@/utils/l10n/locales'
import { isRoutingLocale, toRoutingLocale } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let routingLocale: RoutingLocale
  if (isRoutingLocale(locale)) routingLocale = locale
  else routingLocale = toRoutingLocale(FALLBACK_LOCALE)

  const translations = await serverSideTranslations(routingLocale)

  return {
    props: {
      ...translations,
    },
  }
}

const NextCountrySelectorPage = ({ className }: { className?: string }) => {
  return <CountrySelectorPage className={className} />
}

export default NextCountrySelectorPage
