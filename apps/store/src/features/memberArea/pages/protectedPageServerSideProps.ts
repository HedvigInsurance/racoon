import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getLayoutWithMenuProps } from '@/components/LayoutWithMenu/getLayoutWithMenuProps'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import { getAccessToken } from '@/services/authApi/persist'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'
import { ORIGIN_URL } from '@/utils/url'

// Add props here when they appear
type PageProps = {
  [key: string]: unknown
}
export const protectedPageServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  patchNextI18nContext(context)
  const { locale, req, res } = context

  if (!isRoutingLocale(locale)) return { notFound: true }

  const accessToken = getAccessToken({ req, res })
  if (!accessToken) {
    console.log('Not authenticated, redirecting to login page')
    const redirectTarget = new URL(context.resolvedUrl, ORIGIN_URL)
    redirectTarget.searchParams.set('next', redirectTarget.pathname)
    redirectTarget.pathname = `${locale}/member/login`
    return { redirect: { destination: redirectTarget.toString(), permanent: false } }
  }

  // /se-en/member/insurances -> /member/insurances
  const pathnameWithoutLocale = `/${context.resolvedUrl.split('/').slice(2).join('/')}`
  const apolloClient = await initializeApolloServerSide({ locale, req, res })
  const layoutWithMenuProps = await getLayoutWithMenuProps(context, apolloClient)
  const translations = await serverSideTranslations(locale)
  return addApolloState(apolloClient, {
    props: {
      pathnameWithoutLocale,
      ...layoutWithMenuProps,
      ...translations,
    },
  })
}
