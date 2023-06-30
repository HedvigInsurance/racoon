import { fetchStories } from '@/services/storyblok/storyblok'
import { RoutingLocale } from '@/utils/l10n/types'
import { BLOG_ARTICLE_CATEGORY_CONTENT_TYPE } from './blog.constants'
import { type BlogArticleCategory } from './blog.types'

type Params = { locale: RoutingLocale; draft?: boolean }

export const fetchArticleCategories = async ({
  locale,
  draft,
}: Params): Promise<Array<BlogArticleCategory>> => {
  const response = await fetchStories({
    content_type: BLOG_ARTICLE_CATEGORY_CONTENT_TYPE,
    starts_with: `${locale}/`,
    ...(draft && { version: 'draft' }),
  })

  return response.data.stories.map((item) => ({
    id: item.uuid,
    name: item.name,
    href: item.full_slug,
  }))
}
