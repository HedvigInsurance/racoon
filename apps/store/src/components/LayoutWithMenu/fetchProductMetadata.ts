import { ApolloClient } from '@apollo/client'
import { ProductMetadataDocument, ProductMetadataQuery } from '@/services/apollo/generated'

export const GLOBAL_PRODUCT_METADATA_PROP_NAME = 'globalProductMetadata'

type Params = {
  apolloClient: ApolloClient<unknown>
}

export const fetchGlobalProductMetadata = async ({ apolloClient }: Params) => {
  const { data } = await apolloClient.query<ProductMetadataQuery>({
    query: ProductMetadataDocument,
  })
  return data.availableProducts
}

export type GlobalProductMetadata = Awaited<ReturnType<typeof fetchGlobalProductMetadata>>
