import { getStoriesBySlug, type StoryOptions } from '@/services/storyblok/storyblok'
import { ORIGIN_URL } from '@/utils/PageLink'
import { BreadcrumbListItem } from './BreadcrumbList'

export const fetchBreadcrumbs = async (
  slug: string,
  options: StoryOptions,
): Promise<Array<BreadcrumbListItem>> => {
  const absoluteSlug = slug.startsWith('/') ? slug : `/${slug}`

  const parentSlugs = absoluteSlug
    .split('/')
    .slice(0, -1)
    .map((_, index, array) => array.slice(0, index + 1).join('/'))
    .map((item) => `${options.locale}${item}/`)

  // No point in fetching breadcrumbs for root page
  if (parentSlugs.length < 2) return []

  const stories = await getStoriesBySlug(parentSlugs, { version: options.version })

  return stories
    .sort((a, b) => a.full_slug.length - b.full_slug.length)
    .map((item) => {
      const slugWithoutTrailingSlash = item.full_slug.replace(/\/$/, '')
      return {
        label: item.name,
        href: `${ORIGIN_URL}/${slugWithoutTrailingSlash}`,
      }
    })
}
