import { Button } from 'ui'
import { PageLink } from '@/lib/PageLink'
import { CheckoutPageLayout } from './CheckoutPageLayout'

export const CheckoutSignPage = () => {
  return (
    <form method="post" action={PageLink.apiCheckoutPersonSign()}>
      <CheckoutPageLayout>
        <Button type="submit" fullWidth>
          Sign with BankID
        </Button>
      </CheckoutPageLayout>
    </form>
  )
}
