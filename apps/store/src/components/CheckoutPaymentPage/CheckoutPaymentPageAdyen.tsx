import { useState } from 'react'
import { Button, Space } from 'ui'
import { PriceBreakdown } from '@/components/PriceBreakdown.tsx/PriceBreakdown'
import { Text } from '@/components/Text/Text'
import { PageLink } from '@/lib/PageLink'
import { AdyenCheckout } from '@/services/adyen/AdyenCheckout'
import { CheckoutPaymentPage } from './CheckoutPaymentPage'
import { CheckoutPaymentPageProps } from './CheckoutPaymentPage.types'

export const CheckoutPaymentPageAdyen = (props: CheckoutPaymentPageProps) => {
  const [paymentConnection, setPaymentConnection] = useState<unknown | null>(null)

  return (
    <CheckoutPaymentPage Header={<a href={PageLink.checkout()}>Return to personal details</a>}>
      <Space y={1.5}>
        <Space y={0.5}>
          <PriceBreakdown {...props} />
          <p>
            <Text size="s">
              Money is withdrawn the end of each month. We handle payments securely with Adyen.
            </Text>
          </p>
        </Space>
        <AdyenCheckout onSuccess={(connection) => setPaymentConnection(connection)} />
        <Space y={0.5}>
          <form method="post" action={PageLink.apiCheckoutPaymentSign()}>
            <Button disabled={paymentConnection === null} fullWidth>
              Complete purchase
            </Button>
          </form>
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
