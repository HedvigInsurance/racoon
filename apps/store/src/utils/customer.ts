import { ShopSessionAuthenticationStatus, ShopSessionCustomer } from '@/services/graphql/generated'

const isNewMember = (customer: ShopSessionCustomer) =>
  customer.authenticationStatus === ShopSessionAuthenticationStatus.None

export const getShouldCollectEmail = (customer?: ShopSessionCustomer | null) => {
  // Collect emails of new customers as well as returning customers with no email
  return !customer?.email
}

export const getShouldCollectName = (customer: ShopSessionCustomer) => {
  return isNewMember(customer) && !(customer.firstName && customer.lastName)
}
