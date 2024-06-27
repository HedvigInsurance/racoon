import { StoryblokStory } from '@storyblok/react/rsc'
import { storyblokBridgeOptions } from '@/appComponents/storyblokBridgeOptions'
import { type PageStory } from '@/services/storyblok/storyblok'
import { type RoutingLocale } from '@/utils/l10n/types'
import { BlogStoryContainer } from './BlogStoryContainer'
import { ContentTypeStructuredData } from './ContentTypeStructuredData'

type Props = {
  locale: RoutingLocale
  story: PageStory
}

export function ContentCmsPage({ locale, story }: Props) {
  return (
    <>
      <BlogStoryContainer locale={locale} story={story}>
        <StoryblokStory story={story} bridgeOptions={storyblokBridgeOptions} />
      </BlogStoryContainer>
      <ContentTypeStructuredData story={story} />
    </>
  )
}
