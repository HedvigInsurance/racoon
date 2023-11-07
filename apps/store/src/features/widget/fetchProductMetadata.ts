import { ISbStoryData } from '@storyblok/react'
import {
  GlobalProductMetadata,
  fetchGlobalProductMetadata,
} from '@/components/LayoutWithMenu/fetchProductMetadata'
import { initializeApollo } from '@/services/apollo/client'
import { getStoryById } from '@/services/storyblok/storyblok'
import { RoutingLocale } from '@/utils/l10n/types'

type Params = {
  locale: RoutingLocale
  flow: string
  draft?: boolean
}

type ProductMetadataStory = ISbStoryData<{ productName: string }>
type Story = ISbStoryData<{ products: Array<ProductMetadataStory> }>

export const fetchProductMetadata = async (params: Params): Promise<GlobalProductMetadata> => {
  const apolloClient = initializeApollo({ locale: params.locale })

  const [allProductMetadata, story] = await Promise.all([
    fetchGlobalProductMetadata({ apolloClient }),
    getStoryById<Story>({
      id: params.flow,
      version: params.draft ? 'draft' : undefined,
      resolve_relations: 'widgetFlow.products',
    }),
  ])

  const selected = new Set<string>(story.content.products.map((item) => item.content.productName))
  const productMetadata = allProductMetadata.filter((item) => selected.has(item.name))
  return productMetadata
}
