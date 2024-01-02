import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getLayoutWithMenuProps } from '@/components/LayoutWithMenu/getLayoutWithMenuProps'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import { getAccessToken } from '@/services/authApi/persist'
import { Features } from '@/utils/Features'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { ORIGIN_URL } from '@/utils/PageLink'

// Add props here when they appear
type PageProps = {
  [key: string]: unknown
}
export const protectedPageServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const { locale, req, res } = context

  if (!Features.enabled('MEMBER_AREA')) return { notFound: true }
  if (!isRoutingLocale(locale)) return { notFound: true }

  const accessToken = getAccessToken({ req, res })
  if (!accessToken) {
    console.log('Not authenticated, redirecting to login page')
    const redirectTarget = new URL(`${locale}/${context.resolvedUrl}`, ORIGIN_URL)
    redirectTarget.searchParams.set('next', redirectTarget.pathname)
    redirectTarget.pathname = `${locale}/member/login`
    return { redirect: { destination: redirectTarget.toString(), permanent: false } }
  }

  const apolloClient = await initializeApolloServerSide({ locale, req, res })
  const layoutWithMenuProps = await getLayoutWithMenuProps(context, apolloClient)
  const translations = await serverSideTranslations(locale)
  return addApolloState(apolloClient, {
    props: {
      ...layoutWithMenuProps,
      ...translations,
    },
  })
}
