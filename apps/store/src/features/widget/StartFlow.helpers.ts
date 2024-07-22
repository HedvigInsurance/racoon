import { type ApolloClient } from '@apollo/client'
import { type Redirect } from 'next'
import {
  type PageStory,
  type WidgetFlowStory,
  getStoryBySlug,
  type WidgetFlowType,
} from '@/services/storyblok/storyblok'
import { isWidgetFlowStory } from '@/services/storyblok/Storyblok.helpers'
import type { RoutingLocale } from '@/utils/l10n/types'
import { parseCustomerDataSearchParams } from './parseSearchParams'
import { shopSessionCustomerUpdate } from './shopSessionCustomerUpdate'
import { STORYBLOK_WIDGET_FOLDER_SLUG } from './widget.constants'

export const redirectIfRunningInStoryblokEditor = (url: URL): Redirect | undefined => {
  const runningInStoryblokEditor = url.searchParams.has('_storyblok')
  if (runningInStoryblokEditor) {
    url.pathname = url.pathname.replace('widget/flows', 'widget/preview')
    return { destination: url.href, permanent: false }
  }
}

type FetchFlowMetadataParams = {
  slug: string
  locale: RoutingLocale
  draftMode?: boolean
}

type FlowMetadata = {
  flow: string
  flowType: WidgetFlowType
  partnerName: string
  campaignCode?: string
}

export const fetchFlowMetadata = async (
  params: FetchFlowMetadataParams,
): Promise<FlowMetadata | undefined> => {
  const slug = `${STORYBLOK_WIDGET_FOLDER_SLUG}/flows/${params.slug}`
  const story = await getStoryBySlug<PageStory | WidgetFlowStory>(slug, {
    locale: params.locale,
    version: params.draftMode ? 'draft' : undefined,
  })

  if (isWidgetFlowStory(story)) {
    return {
      flow: String(story.id),
      flowType: story.content.flowType,
      partnerName: story.content.partner,
      campaignCode: story.content.campaignCode,
    }
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
      console.log('Widget | Updated customer data:', customerData)
    } catch (error) {
      console.warn('Failed to update customer data', error)
    }
  }

  return unusedSearchParams
}
