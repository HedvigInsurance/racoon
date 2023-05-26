import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { CheckIcon, Text, theme } from 'ui'
import { trustlyIframeStyles } from '@/services/trustly/TrustlyIframe'
import { Layout } from './Layout'

export const SuccessState = () => {
  const { t } = useTranslation()

  return (
    <Layout>
      <IframePlaceholder>
        <CheckIcon color={theme.colors.greenElement} />
        <Text size={{ _: 'md', lg: 'lg' }}>{t('PAYMENT_CONNECT_SUCCESS')}</Text>
      </IframePlaceholder>
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
