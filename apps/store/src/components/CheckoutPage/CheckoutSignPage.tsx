import { Button } from 'ui'
import { CheckoutPageLayout } from './CheckoutPageLayout'

export const CheckoutSignPage = () => {
  return (
    <CheckoutPageLayout>
      <Button type="submit" fullWidth>
        Sign with BankID
      </Button>
    </CheckoutPageLayout>
  )
}
