import { CheckoutFragment } from '@/services/apollo/generated'

export type CheckoutContactDetailsPageProps = {
  checkoutId: string
  checkoutSigningId: string | null
  prefilledData: CheckoutFragment['contactDetails']
  onSuccess: () => void
}
