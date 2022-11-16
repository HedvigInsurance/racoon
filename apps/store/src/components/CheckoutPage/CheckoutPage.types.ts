import { CartFragmentFragment } from '@/services/apollo/generated'

type ProductData = {
  offerId: string
  name: string
  cost: number
  startDate?: string
  errorMessage?: string
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
  userErrors: UserErrors
  cart: CartFragmentFragment
}

export type UserErrors = Record<string, string>
