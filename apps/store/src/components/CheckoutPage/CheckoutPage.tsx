import { Button } from 'ui'
import { PageLink } from '@/lib/PageLink'
import { CheckoutPageLayout } from './CheckoutPageLayout'

export const CheckoutPage = () => {
  return (
    <form method="post" action={PageLink.apiCheckoutPersonCreate()}>
      <CheckoutPageLayout>
        <Button type="submit" fullWidth>
          Continue to payment
        </Button>
      </CheckoutPageLayout>
    </form>
  )
}
