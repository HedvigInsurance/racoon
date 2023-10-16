import styled from '@emotion/styled'
import { type GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { CheckIcon, Space, Text, theme } from 'ui'
import { Layout } from '@/components/PaymentConnectPage/Layout'
import { trustlyIframeStyles } from '@/services/trustly/TrustlyIframe'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

export const getStaticProps: GetStaticProps = async (context) => {
  if (!isRoutingLocale(context.locale)) return { notFound: true }
  return { props: { ...(await serverSideTranslations(context.locale)) } }
}

const Page = () => {
  const { t } = useTranslation(['common', 'checkout'])

  return (
    <Layout>
      <Space y={0.75}>
        <IframePlaceholder>
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

const IframePlaceholder = styled.div(trustlyIframeStyles, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: theme.space.xs,
})

export default Page
