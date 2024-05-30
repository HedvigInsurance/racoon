import type { ShopSessionCustomerFragment } from '@/services/graphql/generated'
import { ShopSessionCustomerMissingField } from '@/services/graphql/generated'

export const getShouldCollectEmail = (customer?: ShopSessionCustomerFragment | null) => {
  return customer == null || customer.missingFields.includes(ShopSessionCustomerMissingField.Email)
}

export const getShouldCollectName = (customer: ShopSessionCustomerFragment) => {
  return (
    customer.missingFields.includes(ShopSessionCustomerMissingField.FirstName) ||
    customer.missingFields.includes(ShopSessionCustomerMissingField.LastName)
  )
}
