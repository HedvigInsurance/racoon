import { type ApolloClient } from '@apollo/client'
import {
  ProductDataDocument,
  type ProductDataQuery,
  type ProductDataQueryVariables,
} from '@/services/apollo/generated'
import { ProductData } from './ProductData.types'

type Params = {
  apolloClient: ApolloClient<unknown>
  productName: string
}

export const fetchProductData = async (params: Params): Promise<ProductData> => {
  const { data } = await params.apolloClient.query<ProductDataQuery, ProductDataQueryVariables>({
    query: ProductDataDocument,
    variables: { productName: params.productName },
  })

  if (!data.product) {
    throw new Error(`Unable to fetch product data: ${params.productName}`)
  }

  return data.product
}
