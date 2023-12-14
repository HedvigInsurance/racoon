import { type ApolloClient } from '@apollo/client'
import {
  ProductDataDocument,
  type ProductDataQuery,
  type ProductDataQueryVariables,
} from '@/services/graphql/generated'
import { ProductData } from './ProductData.types'

type Params = ProductDataQueryVariables & {
  apolloClient: ApolloClient<unknown>
}

export const fetchProductData = async ({
  apolloClient,
  ...variables
}: Params): Promise<ProductData> => {
  const { data } = await apolloClient.query<ProductDataQuery, ProductDataQueryVariables>({
    query: ProductDataDocument,
    variables,
  })

  if (!data.product) {
    throw new Error(`Unable to fetch product data: ${variables.productName}`)
  }

  return data.product
}
