import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { Text, WarningTriangleIcon, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { Layout } from '@/components/PaymentConnectPage/Layout'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useAdyenTranslations } from '@/services/adyen/useAdyenTranslations'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'

const PaymentConnectLegacyErrorPage = () => {
  const { routingLocale } = useCurrentLocale()
  const { title, retry, error } = useAdyenTranslations()

  return (
    <Layout title={title}>
      <Centered>
        <SpaceFlex space={1} direction="vertical" align="center">
          <WarningTriangleIcon color={theme.colors.signalAmberElement} />
          <div>
            <Text as="p" align="center">
              {error.heading}
            </Text>
            <Text as="p" align="center" color="textSecondary" balance={true}>
              {error.body}
            </Text>
          </div>
        </SpaceFlex>
        <ButtonNextLink
          href={PageLink.paymentConnectLegacy({ locale: routingLocale })}
          size="medium"
          onClick={() => datadogRum.addAction('PaymentConnectLegacy Retry')}
        >
          {retry}
        </ButtonNextLink>
      </Centered>
    </Layout>
  )
}

const Centered = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.space.lg,
})

export default PaymentConnectLegacyErrorPage
