import styled from '@emotion/styled'
import { type GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { CheckIcon, Space, Text, theme } from 'ui'
import { Layout } from '@/components/PaymentConnectPage/Layout'
import { trustlyIframeBaseStyles } from '@/services/trustly/TrustlyIframe.css'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'
import { staticPathsPerSwedenLocale } from '@/utils/staticPaths'

export const getStaticProps: GetStaticProps = async (context) => {
  patchNextI18nContext(context)
  if (!isRoutingLocale(context.locale)) return { notFound: true }
  return { props: { ...(await serverSideTranslations(context.locale)) } }
}

const Page = () => {
  const { t } = useTranslation(['common', 'checkout'])

  return (
    <Layout>
      <Space y={0.75}>
        <IframePlaceholder className={trustlyIframeBaseStyles}>
          <CheckIcon color={theme.colors.signalGreenElement} />
          <Text size={{ _: 'md', lg: 'lg' }}>{t('PAYMENT_CONNECT_SUCCESS')}</Text>
        </IframePlaceholder>
        <Text size="xs" align="center" balance={true}>
          {t('checkout:PAYMENT_TRUSTLY_FOOTNOTE')}
        </Text>
      </Space>
    </Layout>
  )
}

const IframePlaceholder = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: theme.space.xs,
})

export const getStaticPaths = staticPathsPerSwedenLocale

export default Page
