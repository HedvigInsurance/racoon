import { type ApolloClient } from '@apollo/client'
import { type Redirect } from 'next'
import {
  type PageStory,
  type WidgetFlowStory,
  getStoryBySlug,
} from '@/services/storyblok/storyblok'
import { isWidgetFlowStory } from '@/services/storyblok/Storyblok.helpers'
import { RoutingLocale } from '@/utils/l10n/types'
import { parseCustomerDataSearchParams } from './parseSearchParams'
import { shopSessionCustomerUpdate } from './shopSessionCustomerUpdate'
import { STORYBLOK_WIDGET_FOLDER_SLUG } from './widget.constants'

export const redirectIfRunningInStoryblokEditor = (
  url: URL,
  locale: RoutingLocale,
): Redirect | undefined => {
  const runningInStoryblokEditor = url.searchParams.has('_storyblok')
  if (runningInStoryblokEditor) {
    url.pathname = url.pathname.replace('/widget/flows', `${locale}/widget/preview`)
    return { destination: url.href, permanent: false }
  }
}

type FetchFlowMetadataParams = {
  slug: string
  locale: RoutingLocale
  draftMode?: boolean
}

type FlowMetadata = { flow: string; partnerName: string }

export const fetchFlowMetadata = async (
  params: FetchFlowMetadataParams,
): Promise<FlowMetadata | undefined> => {
  const slug = `${STORYBLOK_WIDGET_FOLDER_SLUG}/flows/${params.slug}`
  const story = await getStoryBySlug<PageStory | WidgetFlowStory>(slug, {
    locale: params.locale,
    version: params.draftMode ? 'draft' : undefined,
  })
  const flow = String(story.id)

  if (isWidgetFlowStory(story)) {
    return { flow, partnerName: story.content.partner }
  }

  console.warn('Story is not a widget flow story:', story.slug)
}

type UpdateCustomerDataIfPresentParams = {
  apolloClient: ApolloClient<unknown>
  shopSessionId: string
  searchParams: URLSearchParams
}

export const updateCustomerDataIfPresent = async (params: UpdateCustomerDataIfPresentParams) => {
  const [customerData, unusedSearchParams] = parseCustomerDataSearchParams(params.searchParams)
  if (Object.keys(customerData).length > 0) {
    try {
      await shopSessionCustomerUpdate({
        apolloClient: params.apolloClient,
        variables: { shopSessionId: params.shopSessionId, ...customerData },
      })
    } catch (error) {
      console.warn('Failed to update customer data', error)
    }
  }

  return unusedSearchParams
}