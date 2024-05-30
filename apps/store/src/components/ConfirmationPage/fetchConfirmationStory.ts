import type { ConfirmationStory } from '@/services/storyblok/storyblok'
import { getStoryBySlug } from '@/services/storyblok/storyblok'
import type { RoutingLocale } from '@/utils/l10n/types'

const CONFIRMATION_PAGE_SLUG = 'confirmation'

export const fetchConfirmationStory = (locale: RoutingLocale): Promise<ConfirmationStory> => {
  return getStoryBySlug<ConfirmationStory>(CONFIRMATION_PAGE_SLUG, { locale })
}
