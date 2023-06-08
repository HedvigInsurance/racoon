import { type ISbStoryData, type SbBlokData } from '@storyblok/react'
import {
  BLOG_ARTICLE_CATEGORIES_PAGE_PROP,
  BLOG_ARTICLE_CATEGORY_LIST_BLOCK,
  BLOG_ARTICLE_LIST_BLOCK,
  BLOG_ARTICLE_TEASERS_PAGE_PROP,
} from './blog.constants'
import { fetchArticleCategories } from './fetchAricleCategories'
import { fetchArticleTeasers } from './fetchArticleTeasers'

export const fetchBlogPageProps = async (story: ISbStoryData) => {
  const [teasers, categories] = await Promise.all([
    fetchArticleTeasersIfNeeded(story),
    fetchArticleCategoriesIfNeeded(story),
  ])

  return {
    ...(teasers && { [BLOG_ARTICLE_TEASERS_PAGE_PROP]: teasers }),
    ...(categories && { [BLOG_ARTICLE_CATEGORIES_PAGE_PROP]: categories }),
  }
}

const fetchArticleTeasersIfNeeded = async (story: ISbStoryData) => {
  if (!findBlock(story, BLOG_ARTICLE_LIST_BLOCK)) return
  return fetchArticleTeasers()
}

const fetchArticleCategoriesIfNeeded = async (story: ISbStoryData) => {
  if (!findBlock(story, BLOG_ARTICLE_CATEGORY_LIST_BLOCK)) return
  return fetchArticleCategories()
}

const findBlock = (story: ISbStoryData, component: string) => {
  const body = story.content.body as Array<SbBlokData> | undefined
  return body?.find((item) => item.component === component)
}
