import { type Metadata } from 'next'
import type { ConfirmationStory } from '@/services/storyblok/storyblok'
import { getStoryBySlug } from '@/services/storyblok/storyblok'
import type { RoutingLocale } from '@/utils/l10n/types'

type Params = { locale: RoutingLocale; shopSessionId: string }

type Props = { params: Params }

export default function Page() {
  return null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const story = await fetchConfirmationStory(params.locale)

  return { title: story.content.seoTitle }
}

function fetchConfirmationStory(locale: RoutingLocale): Promise<ConfirmationStory> {
  const CONFIRMATION_PAGE_SLUG = 'confirmation'

  return getStoryBySlug<ConfirmationStory>(CONFIRMATION_PAGE_SLUG, { locale })
}
