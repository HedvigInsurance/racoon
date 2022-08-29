import { CheckoutFragment } from '@/services/apollo/generated'

export type CheckoutPageProps = {
  prefilledData: CheckoutFragment['contactDetails']
}
