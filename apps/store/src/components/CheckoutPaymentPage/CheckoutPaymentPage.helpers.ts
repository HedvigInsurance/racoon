import { ApolloClient } from '@apollo/client'
import {
  CountryCode,
  PaymentProvidersDocument,
  PaymentProvidersQuery,
  PaymentProvidersQueryVariables,
} from '@/services/apollo/generated'

type Params = {
  apolloClient: ApolloClient<unknown>
  countryCode: CountryCode
}

export const fetchAvailablePaymentMethods = async ({ apolloClient, countryCode }: Params) => {
  const { data } = await apolloClient.query<PaymentProvidersQuery, PaymentProvidersQueryVariables>({
    query: PaymentProvidersDocument,
    variables: { countryCode },
  })

  const adyenProvider = data.paymentProviders.find(isAdyenProvider)

  if (adyenProvider === undefined) throw new Error('No Adyen provider available')

  return adyenProvider.availablePaymentMethods
}

type Provider = PaymentProvidersQuery['paymentProviders'][number]
type AdyenProvider = Extract<Provider, { __typename?: 'PaymentProviderAdyen' | undefined }>

const isAdyenProvider = (provider: Provider): provider is AdyenProvider => {
  return provider.__typename === 'PaymentProviderAdyen'
}
