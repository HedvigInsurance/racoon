import { getStoryById, type WidgetFlowStory } from '@/services/storyblok/storyblok'
import { RoutingLocale } from '@/utils/l10n/types'

type Params = {
  locale: RoutingLocale
  flow: string
  draft?: boolean
}

export const fetchSignPageContent = async (params: Params) => {
  const story = await getStoryById<WidgetFlowStory>({
    id: params.flow,
    version: params.draft ? 'draft' : undefined,
    resolve_relations: 'widgetFlow.checkoutPageContent',
  })

  return story.content.checkoutPageContent
}
