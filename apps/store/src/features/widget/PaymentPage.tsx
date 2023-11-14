import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { Heading, Space, Text } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { publishPartnerEvent } from '@/services/partner/publishPartnerEvent'
import { TrustlyIframe } from '@/services/trustly/TrustlyIframe'
import { PageLink } from '@/utils/PageLink'
import { Header } from './Header'

const LOGGER = datadogLogs.createLogger('widget-payment')

type Props = {
  flow: string
  shopSessionId: string
  trustlyUrl: string
}

export const PaymentPage = (props: Props) => {
  const { t } = useTranslation('checkout')
  const router = useRouter()
  const nextUrl = PageLink.widgetConfirmation({
    flow: props.flow,
    shopSessionId: props.shopSessionId,
  })

  const handleSuccess = () => {
    LOGGER.info('Trustly payment success', { shopSessionId: props.shopSessionId })
    publishPartnerEvent({ status: 'success' })
    router.push(nextUrl)
  }

  const handleFail = () => {
    LOGGER.warn('Trustly payment failed', { shopSessionId: props.shopSessionId })
    router.push(nextUrl)
  }

  return (
    <Space y={4}>
      <Header step="PAY" />

      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <Space y={3.5}>
            <div>
              <Heading as="h1" variant="standard.24" align="center">
                {t('PAYMENT_TRUSTLY_TITLE')}
              </Heading>
              <Text size="xl" color="textSecondary" align="center" balance={true}>
                {t('PAYMENT_TRUSTLY_SUBTITLE')}
              </Text>
            </div>

            <Space y={1}>
              <Text size="xs" color="textSecondary" align="center" balance={true}>
                {t('PAYMENT_TRUSTLY_FOOTNOTE')}
              </Text>

              <StyledTrustlyIframe
                url={props.trustlyUrl}
                onSuccess={handleSuccess}
                onFail={handleFail}
              />
            </Space>
          </Space>
        </GridLayout.Content>
      </GridLayout.Root>
    </Space>
  )
}

const StyledTrustlyIframe = styled(TrustlyIframe)({ height: '60vh' })
