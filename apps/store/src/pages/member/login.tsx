import { GetServerSidePropsContext } from 'next'
import { LoginPage } from '@/features/memberArea/LoginPage'
import { Features } from '@/utils/Features'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { locale } = context

  if (!Features.enabled('MEMBER_AREA')) return { notFound: true }
  if (!isRoutingLocale(locale)) return { notFound: true }

  // TODO: If logged in - redirect to next, preserving other query params, default to /member

  return {
    props: {},
  }
}

export default LoginPage
