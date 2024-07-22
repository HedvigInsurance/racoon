import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { type GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { type FormEventHandler, useState } from 'react'
import { Button, Space, Text, theme } from 'ui'
import { Layout } from '@/components/PaymentConnectPage/Layout'
import { getAccessToken } from '@/services/authApi/persist'
import { trustlyIframeBaseStyles } from '@/services/trustly/TrustlyIframe.css'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'
import { staticPathsPerSwedenLocale } from '@/utils/staticPaths'

export const getStaticProps: GetStaticProps = async (context) => {
  patchNextI18nContext(context)
  if (!isRoutingLocale(context.locale)) return { notFound: true }
  return { props: { ...(await serverSideTranslations(context.locale)) } }
}

const Page = () => {
  const { t } = useTranslation(['common', 'checkout'])
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const locale = useRoutingLocale()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    datadogRum.addAction('Payment Connect Init')
    setLoading(true)

    const readyPathname = PageLink.paymentConnectReady({ locale }).pathname
    const isLoggedIn = !!getAccessToken()
    if (isLoggedIn) {
      return await router.push(readyPathname)
    }

    return await router.push(PageLink.memberAreaLogin({ locale, next: readyPathname }).toRelative())
  }

  return (
    <Layout>
      <Space y={0.75}>
        <form onSubmit={handleSubmit}>
          <IframePlaceholder className={trustlyIframeBaseStyles}>
            <WideSpace y={0.5}>
              <Button loading={loading} fullWidth={true}>
                {t('FLOW_ACTIVATION_BUTTON')}
              </Button>
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

const IframePlaceholder = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'stretch',
  backgroundColor: theme.colors.white,
  paddingInline: theme.space.xl,
})

const WideSpace = styled(Space)({ width: '100%' })

export const getStaticPaths = staticPathsPerSwedenLocale

export default Page
