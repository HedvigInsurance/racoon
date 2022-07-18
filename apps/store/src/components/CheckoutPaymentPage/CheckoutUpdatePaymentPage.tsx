import styled from '@emotion/styled'
import { Space } from 'ui'
import { Text } from '@/components/Text/Text'
import { TrustlyWidget } from '@/services/trustly/TrustlyWidget'
import { CheckoutPaymentPage } from './CheckoutPaymentPage'
import { CheckoutPaymentPageProps } from './CheckoutPaymentPage.types'
import { PriceBreakdown } from './PriceBreakdown'

const TRUSTLY_WIDGET_HEIGHT = 171.33

export const CheckoutUpdatePaymentPage = (props: CheckoutPaymentPageProps) => {
  return (
    <CheckoutPaymentPage>
      <Space y={1.5}>
        <Space y={0.5}>
          <PriceBreakdown {...props} />
          <p>
            <Text size="s">
              Money is withdrawn the end of each month. We handle payments securely with Trustly.
            </Text>
          </p>
        </Space>
        <TrustlyWidgetWrapper>
          <TrustlyWidget />
        </TrustlyWidgetWrapper>
      </Space>
    </CheckoutPaymentPage>
  )
}

const TrustlyWidgetWrapper = styled.div(({ theme }) => ({
  display: 'flex',
  minHeight: TRUSTLY_WIDGET_HEIGHT,
  backgroundColor: theme.colors.gray300,
  justifyContent: 'center',

  '#trustly-widget': {
    backgroundColor: theme.colors.white,
    margin: 0,
    maxWidth: '100%',
  },
}))
