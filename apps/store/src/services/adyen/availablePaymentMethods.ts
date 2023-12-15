import { type CoreOptions } from '@adyen/adyen-web/dist/types/core/types'
import { ApolloClient } from '@apollo/client'
import {
  AdyenAvailablePaymentMethodsDocument,
  type AdyenAvailablePaymentMethodsQuery,
} from '@/services/graphql/generated'

type PaymentMethodsResponseObject = Required<CoreOptions>['paymentMethodsResponse']

export const availablePaymentMethods = async (
  apolloClient: ApolloClient<unknown>,
): Promise<PaymentMethodsResponseObject> => {
  const response = await apolloClient.query<AdyenAvailablePaymentMethodsQuery>({
    query: AdyenAvailablePaymentMethodsDocument,
  })

  const rawPaymentMethodsResponse = response.data.availablePaymentMethods2.paymentMethodsResponse
  if (typeof rawPaymentMethodsResponse !== 'string') {
    throw new Error('Failed to fetch available payment methods')
  }

  const paymentMethodsResponse = JSON.parse(rawPaymentMethodsResponse)
  return paymentMethodsResponse as PaymentMethodsResponseObject
}
