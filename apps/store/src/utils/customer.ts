import { ShopSessionAuthenticationStatus, ShopSessionCustomer } from '@/services/apollo/generated'

const isNewMember = (customer: ShopSessionCustomer) =>
  customer.authenticationStatus === ShopSessionAuthenticationStatus.None

export const shouldCollectEmail = (customer?: ShopSessionCustomer | null) => {
  return !customer || customer.authenticationStatus === ShopSessionAuthenticationStatus.None
}

export const shouldCollectName = (customer: ShopSessionCustomer) => {
  return isNewMember(customer) && !(customer.firstName && customer.lastName)
}
