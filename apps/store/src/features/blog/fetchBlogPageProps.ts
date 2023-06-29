import { type ISbStoryData, type SbBlokData } from '@storyblok/react'
import { RoutingLocale } from '@/utils/l10n/types'
import {
  BLOG_ARTICLE_CATEGORIES_PAGE_PROP,
  BLOG_ARTICLE_CATEGORY_LIST_BLOCK,
  BLOG_ARTICLE_LIST_BLOCK,
  BLOG_ARTICLE_TEASERS_PAGE_PROP,
} from './blog.constants'
import { fetchArticleCategories } from './fetchAricleCategories'
import { fetchArticleTeasers } from './fetchArticleTeasers'

type Params = {
  locale: RoutingLocale
  story: ISbStoryData
  draft: boolean
}

export const fetchBlogPageProps = async (params: Params) => {
  const [teasers, categories] = await Promise.all([
    fetchArticleTeasersIfNeeded(params),
    fetchArticleCategoriesIfNeeded(params),
  ])

  return {
    ...(teasers && { [BLOG_ARTICLE_TEASERS_PAGE_PROP]: teasers }),
    ...(categories && { [BLOG_ARTICLE_CATEGORIES_PAGE_PROP]: categories }),
  }
}

const fetchArticleTeasersIfNeeded = async ({ story, locale, draft }: Params) => {
  if (!findBlock(story, BLOG_ARTICLE_LIST_BLOCK)) return
  return fetchArticleTeasers({ locale, draft })
}

const fetchArticleCategoriesIfNeeded = async ({ story, locale, draft }: Params) => {
  if (!findBlock(story, BLOG_ARTICLE_CATEGORY_LIST_BLOCK)) return
  return fetchArticleCategories({ locale, draft })
}

const findBlock = (story: ISbStoryData, component: string) => {
  const body = story.content.body as Array<SbBlokData> | undefined
  return body?.find((item) => item.component === component)
}
