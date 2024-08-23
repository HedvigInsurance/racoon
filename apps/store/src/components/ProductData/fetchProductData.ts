import { type ApolloClient, type DefaultContext } from '@apollo/client'
import {
  ProductDataDocument,
  type ProductDataQuery,
  type ProductDataQueryVariables,
} from '@/services/graphql/generated'
import type { ProductData } from './ProductData.types'

type Params = ProductDataQueryVariables & {
  apolloClient: ApolloClient<unknown>
  context?: DefaultContext
}

export const fetchProductData = async ({
  apolloClient,
  context,
  ...variables
}: Params): Promise<ProductData> => {
  const { data } = await apolloClient.query<ProductDataQuery, ProductDataQueryVariables>({
    query: ProductDataDocument,
    variables,
    context,
  })

  if (!data.product) {
    throw new Error(`Unable to fetch product data: ${variables.productName}`)
  }

  return data.product
}
