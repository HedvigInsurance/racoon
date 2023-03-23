import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

export { ForeverPage as default } from '@/components/ForeverPage/ForeverPage'

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context
  if (!isRoutingLocale(locale)) return { notFound: true }
  const translations = await serverSideTranslations(locale)
  return { props: { ...translations } }
}
