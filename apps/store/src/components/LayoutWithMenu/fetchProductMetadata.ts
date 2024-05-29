import type { ApolloClient } from '@apollo/client'
import type { ProductMetadataQuery } from '@/services/graphql/generated'
import { ProductMetadataDocument } from '@/services/graphql/generated'

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
