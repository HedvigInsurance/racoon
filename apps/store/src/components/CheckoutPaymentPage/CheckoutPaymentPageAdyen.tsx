import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { Button, Space } from 'ui'
import { PriceBreakdown } from '@/components/PriceBreakdown/PriceBreakdown'
import { Text } from '@/components/Text/Text'
import { AdyenCheckout } from '@/services/adyen/AdyenCheckout'
import * as Auth from '@/services/Auth/Auth'
import { useHandleSignCheckout } from '@/services/Checkout/useHandleSignCheckout'
import { setupShopSessionServiceClientSide } from '@/services/shopSession/ShopSession.helpers'
import { PageLink } from '@/utils/PageLink'
import { CheckoutPaymentPage } from './CheckoutPaymentPage'
import { CheckoutPaymentPageAdyenProps } from './CheckoutPaymentPage.types'

export const CheckoutPaymentPageAdyen = ({
  paymentMethodsResponse,
  isPaymentConnected,
  shopSessionId,
  checkoutId,
  checkoutSigningId,
  ...props
}: CheckoutPaymentPageAdyenProps) => {
  const apolloClient = useApolloClient()
  const router = useRouter()
  const [startSign, { loading: loadingSign }] = useHandleSignCheckout({
    checkoutId,
    checkoutSigningId,
    onSuccess(accessToken) {
      Auth.save(accessToken)
      setupShopSessionServiceClientSide(apolloClient).reset()

      router.push(PageLink.confirmation({ shopSessionId }))
    },
  })

  const isCompleteButtonDisabled = !isPaymentConnected || loadingSign

  return (
    <CheckoutPaymentPage Header={<a href={PageLink.checkout()}>Return to checkout</a>}>
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
        <AdyenCheckout
          shopSessionId={shopSessionId}
          paymentMethodsResponse={paymentMethodsResponse}
          onSuccess={() => {}}
        />
        <Space y={0.5}>
          <Button onClick={startSign} disabled={isCompleteButtonDisabled} fullWidth>
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
