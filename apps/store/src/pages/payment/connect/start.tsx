import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { type GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { type FormEventHandler, useState } from 'react'
import { Button, Space, Text, theme } from 'ui'
import { Layout } from '@/components/PaymentConnectPage/Layout'
import { exchangeAuthorizationCode } from '@/services/authApi/oauth'
import { getAccessToken, saveAuthTokens } from '@/services/authApi/persist'
import { trustlyIframeStyles } from '@/services/trustly/TrustlyIframe'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

const LOGGER = datadogLogs.createLogger('PaymentConnect')
const AUTHORIZATION_CODE_SEARCH_PARAM = 'authorization_code'

export const getStaticProps: GetStaticProps = async (context) => {
  if (!isRoutingLocale(context.locale)) return { notFound: true }
  return { props: { ...(await serverSideTranslations(context.locale)) } }
}

const Page = () => {
  const { t } = useTranslation(['common', 'checkout'])
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    datadogRum.addAction('Payment Connect Init')
    setLoading(true)

    const authorizationCodeParam = router.query[AUTHORIZATION_CODE_SEARCH_PARAM]
    const authorizationCode =
      typeof authorizationCodeParam === 'string' ? authorizationCodeParam : undefined

    if (authorizationCode) {
      try {
        const reponse = await exchangeAuthorizationCode(authorizationCode)
        saveAuthTokens(reponse)
        return await router.push(PageLink.paymentConnectReady())
      } catch (error) {
        LOGGER.warn('Failed to exchange authorization code', { error })
      }
    }

    const isLoggedIn = !!getAccessToken()
    if (!authorizationCode && isLoggedIn) {
      return await router.push(PageLink.paymentConnectReady())
    }

    return await router.push(
      PageLink.memberLogin({ next: PageLink.paymentConnectReady().pathname }),
    )
  }

  return (
    <Layout>
      <Space y={0.75}>
        <form onSubmit={handleSubmit}>
          <IframePlaceholder>
            <WideSpace y={0.5}>
              <Button loading={loading}>{t('FLOW_ACTIVATION_BUTTON')}</Button>
            </WideSpace>
          </IframePlaceholder>
        </form>
        <Text size="xs" align="center" balance={true}>
          {t('PAYMENT_TRUSTLY_FOOTNOTE', { ns: 'checkout' })}
        </Text>
      </Space>
    </Layout>
  )
}

const IframePlaceholder = styled.div(trustlyIframeStyles, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'stretch',
  backgroundColor: theme.colors.white,
  paddingInline: theme.space.xl,
})

const WideSpace = styled(Space)({ width: '100%' })

export default Page
