import { type ApolloClient, type NormalizedCacheObject } from '@apollo/client'

const PLACEHOLDER_URL =
  'https://checkout.test.trustly.com/checkout?OrderID=14303159000&SessionID=57b5b689-249d-4744-88cb-732f6f8b11ae'

type Params = {
  apolloClient: ApolloClient<NormalizedCacheObject>
}

// TODO: refactor
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createTrustlyUrl = async ({ apolloClient }: Params) => {
  return PLACEHOLDER_URL
}
