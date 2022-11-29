import { CartFragmentFragment, CheckoutSigningStatus, UserError } from '@/services/apollo/generated'

type ProductData = {
  offerId: string
  name: string
  cost: number
  startDate?: string
}

export type CheckoutPageProps = {
  products: Array<ProductData>
  loading: boolean
  prefilledData: {
    email?: string
    firstName?: string
    lastName?: string
    personalNumber?: string
    phoneNumber?: string
  }
  signingStatus?: CheckoutSigningStatus
  userError?: UserError | null
  cart: CartFragmentFragment
}
