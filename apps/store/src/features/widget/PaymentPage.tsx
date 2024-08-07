import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { Heading, mq, Space, Text, theme } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { TrustlyIframe } from '@/services/trustly/TrustlyIframe'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { Header } from './Header'
import { publishWidgetEvent } from './publishWidgetEvent'

const LOGGER = datadogLogs.createLogger('widget-payment')

type Props = {
  flow: string
  shopSessionId: string
  trustlyUrl: string
}

export const PaymentPage = (props: Props) => {
  const { t } = useTranslation(['widget', 'checkout'])
  const router = useRouter()
  const locale = useRoutingLocale()
  const nextUrl = PageLink.widgetConfirmation({
    locale,
    flow: props.flow,
    shopSessionId: props.shopSessionId,
  })

  const handleSuccess = () => {
    LOGGER.info('Trustly payment success', { shopSessionId: props.shopSessionId })
    publishWidgetEvent.success()
    router.push(nextUrl)
  }

  const handleFail = () => {
    LOGGER.warn('Trustly payment failed', { shopSessionId: props.shopSessionId })
    router.push(nextUrl)
  }

  return (
    <Wrapper y={2.5}>
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
              <StyledTrustlyIframe
                url={props.trustlyUrl}
                onSuccess={handleSuccess}
                onFail={handleFail}
              />

              <Text size="xs" color="textSecondary" align="center" balance={true}>
                {t('checkout:PAYMENT_TRUSTLY_FOOTNOTE')}
              </Text>
            </Space>
          </Space>
        </GridLayout.Content>
      </GridLayout.Root>
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  paddingBottom: theme.space.lg,
  [mq.lg]: { paddingBottom: theme.space.xxl },
})

const StyledTrustlyIframe = styled(TrustlyIframe)({ height: '60vh' })
