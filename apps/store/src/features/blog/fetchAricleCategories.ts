import { fetchStories } from '@/services/storyblok/storyblok'
import { BLOG_ARTICLE_CATEGORY_CONTENT_TYPE } from './blog.constants'
import { type BlogArticleCategory } from './blog.types'

export const fetchArticleCategories = async (
  draft = false,
): Promise<Array<BlogArticleCategory>> => {
  const response = await fetchStories({
    content_type: BLOG_ARTICLE_CATEGORY_CONTENT_TYPE,
    ...(draft && { version: 'draft' }),
  })

  return response.data.stories.map((item) => ({
    id: item.uuid,
    name: item.name,
    href: item.full_slug,
  }))
}
