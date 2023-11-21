import { type ApolloClient } from '@apollo/client'
import { type ISbStoryData } from '@storyblok/react'
import {
  type GlobalProductMetadata,
  fetchGlobalProductMetadata,
} from '@/components/LayoutWithMenu/fetchProductMetadata'
import { type WidgetFlowStory, getStoryById } from '@/services/storyblok/storyblok'
import { RoutingLocale } from '@/utils/l10n/types'

type Params = {
  apolloClient: ApolloClient<unknown>
  locale: RoutingLocale
  flow: string
  draft?: boolean
}

type ProductMetadataStory = ISbStoryData<{ productName: string }>
type Story = Omit<WidgetFlowStory, 'content'> & {
  content: Omit<WidgetFlowStory['content'], 'products'> & {
    products: Array<ProductMetadataStory>
  }
}

export const fetchFlowProducts = async (
  params: Params,
): Promise<[Story, GlobalProductMetadata]> => {
  const [allProductMetadata, story] = await Promise.all([
    fetchGlobalProductMetadata({ apolloClient: params.apolloClient }),
    getStoryById<Story>({
      id: params.flow,
      version: params.draft ? 'draft' : undefined,
      resolve_relations: 'widgetFlow.products',
    }),
  ])

  const selected = new Set<string>(story.content.products.map((item) => item.content.productName))
  return [story, allProductMetadata.filter((item) => selected.has(item.name))]
}
