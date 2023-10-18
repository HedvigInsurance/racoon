import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { type GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { type FormEventHandler, useState } from 'react'
import { Button, Space, Text, theme } from 'ui'
import { Layout } from '@/components/PaymentConnectPage/Layout'
import { getAccessToken } from '@/services/authApi/persist'
import { trustlyIframeStyles } from '@/services/trustly/TrustlyIframe'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

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

    const isLoggedIn = !!getAccessToken()
    if (isLoggedIn) {
      return await router.push(PageLink.paymentConnectReady().pathname)
    }

    return await router.push(
      PageLink.memberAreaLogin({ next: PageLink.paymentConnectReady().pathname }).toRelative(),
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
