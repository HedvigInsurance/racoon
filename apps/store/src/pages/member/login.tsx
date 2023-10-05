import { GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { LoginPage } from '@/features/memberArea/pages/LoginPage'
import { Features } from '@/utils/Features'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { locale } = context

  if (!Features.enabled('MEMBER_AREA')) return { notFound: true }
  if (!isRoutingLocale(locale)) return { notFound: true }

  // TODO: If logged in - redirect to next, preserving other query params, default to /member

  const translations = await serverSideTranslations(locale)
  return {
    props: {
      ...translations,
    },
  }
}

export default LoginPage
