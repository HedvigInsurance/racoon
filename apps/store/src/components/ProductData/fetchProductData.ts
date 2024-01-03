import { type ApolloClient } from '@apollo/client'
import {
  ProductDataDocument,
  type ProductDataQuery,
  type ProductDataQueryVariables,
} from '@/services/graphql/generated'
import { getReviewsDistribution } from '@/services/productReviews/getReviewsDistribution'
import {
  getProductAverageRating,
  getProductReviewComments,
} from '@/services/productReviews/productReviews'
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

  const averageRating = await getProductAverageRating(variables.productName)
  const reviewComments = await getProductReviewComments(variables.productName)
  const reviewsDistribution = reviewComments ? getReviewsDistribution(reviewComments) : null

  return {
    ...data.product,
    averageRating,
    reviewComments,
    reviewsDistribution,
  }
}
