import styled from '@emotion/styled'
import { TrustlyWidget } from '@/services/trustly/TrustlyWidget'
import { CheckoutPaymentPage } from './CheckoutPaymentPage'
import { CheckoutPaymentPageProps } from './CheckoutPaymentPage.types'

const TRUSTLY_WIDGET_HEIGHT = 171.33

export const CheckoutPaymentPageTrustly = (props: CheckoutPaymentPageProps) => {
  return (
    <CheckoutPaymentPage {...props}>
      <TrustlyWidgetWrapper>
        <TrustlyWidget />
      </TrustlyWidgetWrapper>
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
