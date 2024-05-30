import type { ApolloClient } from '@apollo/client'
import type { GetServerSidePropsContext } from 'next'
import type {
  ShopSessionSigningQuery,
  ShopSessionSigningQueryVariables,
} from '@/services/graphql/generated'
import { ShopSessionSigningDocument } from '@/services/graphql/generated'

type FetchParams = ShopSessionSigningQueryVariables & {
  apolloClient: ApolloClient<unknown>
}

const fetchShopSessionSigning = async ({ apolloClient, ...variables }: FetchParams) => {
  const result = await apolloClient.query<
    ShopSessionSigningQuery,
    ShopSessionSigningQueryVariables
  >({
    query: ShopSessionSigningDocument,
    variables,
  })

  return result.data.shopSessionSigning
}

type FetchCurrentParams = Omit<FetchParams, 'shopSessionSigningId'> & {
  req: GetServerSidePropsContext['req']
}

export const fetchCurrentShopSessionSigning = async ({ req, ...params }: FetchCurrentParams) => {
  // TODO: Set it. Maybe make it session scoped?
  const shopSessionSigningId = req.cookies.shopSessionSigningId

  try {
    if (shopSessionSigningId) {
      return await fetchShopSessionSigning({ ...params, shopSessionSigningId })
    }
  } catch (error) {
    console.warn('Unable to fetch checkout signing %j', { shopSessionSigningId, error })
  }
  return null
}
