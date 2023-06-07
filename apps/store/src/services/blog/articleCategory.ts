import {
  type StoryblokVersion,
  getBlogArticleCategoryStories,
} from '@/services/storyblok/storyblok'
import { BlogArticleCategoryList } from './blogArticleCategoryList'

export const getBlogArticleCategoryList = async (
  version?: StoryblokVersion,
): Promise<BlogArticleCategoryList> => {
  const blogArticles = await getBlogArticleCategoryStories(version)

  return blogArticles.map((item) => ({
    id: item.uuid,
    name: item.name,
    href: item.full_slug,
  }))
}
