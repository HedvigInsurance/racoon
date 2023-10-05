import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { InsurancePage } from '@/features/memberArea/pages/InsurancePage'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import { getAccessToken } from '@/services/authApi/persist'
import { Features } from '@/utils/Features'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

// Add props here when they appear
type PageProps = {
  [key: string]: unknown
}
export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const { locale, req, res } = context

  if (!Features.enabled('MEMBER_AREA')) return { notFound: true }
  if (!isRoutingLocale(locale)) return { notFound: true }

  const accessToken = getAccessToken({ req, res })
  if (!accessToken) {
    // TODO: Remove hardcoded path, add next param and preserve any other query params
    console.log('Not authenticated, redirecting to login page')
    return { redirect: { destination: '/member/login', permanent: false } }
  }

  const apolloClient = await initializeApolloServerSide({ locale, req, res })

  const translations = await serverSideTranslations(locale)
  return addApolloState(apolloClient, {
    props: {
      ...translations,
    },
  })
}
export default InsurancePage
