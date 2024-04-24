// TODO: get rid of this import, services should avoid feature-imports
import { STORYBLOK_MANYPETS_FOLDER_SLUG } from '@/features/manyPets/manyPets.constants'
import { STORYBLOK_WIDGET_FOLDER_SLUG } from '@/features/widget/widget.constants'

export const GLOBAL_STORY_PROP_NAME = 'globalStory'
export const STORY_PROP_NAME = 'story'
// NOTE: Excluding by content_type would be easier to support,
// but according to the docs it's only possible to do if we fetch full stories, not links
export const LINKS_EXCLUDE_PATHS = new Set([
  'reusable-blocks',
  'product-metadata',
  'car-buyer',
  'global',
  STORYBLOK_MANYPETS_FOLDER_SLUG,
  STORYBLOK_WIDGET_FOLDER_SLUG,
])

// From 1w visitor stats for period ending 29.04.2024
export const MOST_VISITED_PATHS = new Set([
  '/se',
  '/se/forsakringar',
  // All product and category pages
  '/se/forsakringar/hemforsakring',
  '/se/forsakringar/hemforsakring/hyresratt',
  '/se/forsakringar/hemforsakring/student',
  '/se/forsakringar/hemforsakring/bostadsratt',
  '/se/forsakringar/hemforsakring/villaforsakring',
  '/se/forsakringar/bilforsakring',
  '/se/forsakringar/djurforsakring',
  '/se/forsakringar/hundforsakring',
  '/se/forsakringar/kattforsakring',
  '/se/forsakringar/olycksfallsforsakring',
  // Other
  '/se/hjalp',
  '/se/hjalp/kundservice',
  '/se/hjalp/faq',
  '/se/hedvig',
])
