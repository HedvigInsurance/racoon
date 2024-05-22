import type { GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { LoginPage } from '@/features/memberArea/pages/LoginPage/LoginPage'
import { getAccessToken } from '@/services/authApi/persist'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { ORIGIN_URL } from '@/utils/PageLink'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  patchNextI18nContext(context)
  const { locale, req, res, resolvedUrl } = context

  if (!isRoutingLocale(locale)) return { notFound: true }

  const isAuthenticated = getAccessToken({ req, res })
  if (isAuthenticated) {
    const redirectTarget = new URL(resolvedUrl, ORIGIN_URL)
    redirectTarget.pathname =
      redirectTarget.searchParams.get('next') ?? `${locale}/member/insurances`
    redirectTarget.searchParams.delete('next')
    console.log(`Logged in, redirecting to ${redirectTarget.toString()}`)
    return { redirect: { destination: redirectTarget.toString(), permanent: false } }
  }

  const translations = await serverSideTranslations(locale)
  return {
    props: {
      ...translations,
    },
  }
}

export default LoginPage
