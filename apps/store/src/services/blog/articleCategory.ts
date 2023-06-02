import { getBlogArticleCategoryStories } from '@/services/storyblok/storyblok'
import { BlogArticleCategoryList } from './blogArticleCategoryList'

export const getBlogArticleCategoryList = async (): Promise<BlogArticleCategoryList> => {
  const blogArticles = await getBlogArticleCategoryStories()

  return blogArticles.map((item) => ({
    id: item.uuid,
    name: item.name,
    href: item.full_slug,
  }))
}
