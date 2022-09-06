import styled from '@emotion/styled'
import { Button, Space } from 'ui'
import { PriceBreakdown } from '@/components/PriceBreakdown.tsx/PriceBreakdown'
import { Text } from '@/components/Text/Text'
import { PageLink } from '@/lib/PageLink'
import { AdyenCheckout } from '@/services/adyen/AdyenCheckout'
import { CheckoutPaymentPage } from './CheckoutPaymentPage'
import { CheckoutPaymentPageAdyenProps } from './CheckoutPaymentPage.types'

export const CheckoutPaymentPageAdyen = ({
  paymentMethods,
  isPaymentConnected,
  ...props
}: CheckoutPaymentPageAdyenProps) => {
  return (
    <CheckoutPaymentPage Header={<a href={PageLink.checkout()}>Return to personal details</a>}>
      <Space y={1.5}>
        <Space y={0.5}>
          <PriceBreakdownWrapper>
            <PriceBreakdown {...props} />
          </PriceBreakdownWrapper>
          <p>
            <Text size="s">
              Money is withdrawn the end of each month. We handle payments securely with Adyen.
            </Text>
          </p>
        </Space>
        <AdyenCheckout paymentMethods={paymentMethods} onSuccess={() => {}} />
        <Space y={0.5}>
          <Button disabled={!isPaymentConnected} fullWidth>
            Complete purchase
          </Button>
          <p>
            <Text size="s">
              By clicking &quot;Complete purchase&quot; I confirm that I have read and understood
              the terms and conditions, and that I approve that Hedvig handles my personal
              information.
            </Text>
          </p>
        </Space>
      </Space>
    </CheckoutPaymentPage>
  )
}

const PriceBreakdownWrapper = styled.div(({ theme }) => ({
  borderRadius: 8,
  backgroundColor: theme.colors.white,
  borderWidth: 1,
  borderColor: theme.colors.gray300,
  borderStyle: 'solid',
  padding: theme.space[2],
  paddingLeft: theme.space[3],
}))
