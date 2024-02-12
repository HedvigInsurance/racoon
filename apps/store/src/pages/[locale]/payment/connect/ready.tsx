import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { type GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'
import { Space, Text } from 'ui'
import { ErrorDialog } from '@/components/PaymentConnectPage/ErrorDialog'
import { Layout } from '@/components/PaymentConnectPage/Layout'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { getAccessToken } from '@/services/authApi/persist'
import { createTrustlyUrl } from '@/services/trustly/createTrustlyUrl'
import { TrustlyIframe } from '@/services/trustly/TrustlyIframe'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

const LOGGER = datadogLogs.createLogger('PaymentConnect')

type Props = {
  trustlyUrl: string
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  patchNextI18nContext(context)
  if (!isRoutingLocale(context.locale)) return { notFound: true }

  const isLoggedIn = !!getAccessToken({ req: context.req })
  if (!isLoggedIn) {
    const redirectUrl = PageLink.memberAreaLogin({
      locale: context.locale,
      next: context.resolvedUrl,
    }).toString()
    return { redirect: { destination: redirectUrl, permanent: false } }
  }

  const apolloClient = await initializeApolloServerSide({
    locale: context.locale,
    req: context.req,
    res: context.res,
  })

  try {
    const [translations, trustlyUrl] = await Promise.all([
      await serverSideTranslations(context.locale),
      await createTrustlyUrl({ apolloClient, locale: context.locale }),
    ])
    return { props: { ...translations, trustlyUrl } }
  } catch (error) {
    console.error('Payment Connect failed to create trustly url: ', error)
    throw new Error('Failed to create trustly url')
  }
}

export const Page = (props: Props) => {
  const { t } = useTranslation('checkout')
  const [isError, setIsError] = useState(false)

  const router = useRouter()
  const locale = useRoutingLocale()
  const handleSuccess = async () => {
    LOGGER.info('Successfully connected to Trustly')
    await router.push(PageLink.paymentConnectSuccess({ locale }).pathname)
  }

  const handleFail = () => {
    LOGGER.warn('Failed to connect to Trustly')
    setIsError(true)
  }

  const handleRetry = () => {
    datadogRum.addAction('Payment Connect Retry')
    router.reload()
  }

  const handleCloseErrorDialog = () => {
    datadogRum.addAction('Payment Connect Error Dialog Close')
    setIsError(false)
  }

  return (
    <Layout>
      <Space y={0.75}>
        <TrustlyIframe url={props.trustlyUrl} onSuccess={handleSuccess} onFail={handleFail} />
        <Text size="xs" align="center" balance={true}>
          {t('PAYMENT_TRUSTLY_FOOTNOTE')}
        </Text>
      </Space>

      <ErrorDialog open={isError} onRetry={handleRetry} onClose={handleCloseErrorDialog} />
    </Layout>
  )
}

export default Page
