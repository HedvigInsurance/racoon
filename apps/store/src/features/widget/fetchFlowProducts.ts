import { ApolloClient } from '@apollo/client'
import { ISbStoryData } from '@storyblok/react'
import {
  GlobalProductMetadata,
  fetchGlobalProductMetadata,
} from '@/components/LayoutWithMenu/fetchProductMetadata'
import { getStoryById } from '@/services/storyblok/storyblok'
import { RoutingLocale } from '@/utils/l10n/types'

type Params = {
  apolloClient: ApolloClient<unknown>
  locale: RoutingLocale
  flow: string
  draft?: boolean
}

type ProductMetadataStory = ISbStoryData<{ productName: string }>
type Story = ISbStoryData<{ products: Array<ProductMetadataStory> }>

export const fetchFlowProducts = async (params: Params): Promise<GlobalProductMetadata> => {
  const [allProductMetadata, story] = await Promise.all([
    fetchGlobalProductMetadata({ apolloClient: params.apolloClient }),
    getStoryById<Story>({
      id: params.flow,
      version: params.draft ? 'draft' : undefined,
      resolve_relations: 'widgetFlow.products',
    }),
  ])

  const selected = new Set<string>(story.content.products.map((item) => item.content.productName))
  return allProductMetadata.filter((item) => selected.has(item.name))
}
