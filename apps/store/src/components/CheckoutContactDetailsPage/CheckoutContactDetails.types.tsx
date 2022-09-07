import { CheckoutFragment } from '@/services/apollo/generated'

export type CheckoutContactDetailsPageProps = {
  prefilledData: CheckoutFragment['contactDetails']
}
