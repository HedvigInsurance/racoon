import { type Context, createContext, useContext } from 'react'
import { BLOG_ARTICLE_CATEGORIES_PAGE_PROP, BLOG_ARTICLE_TEASERS_PAGE_PROP } from './blog.constants'
import { type BlogArticleCategory, type BlogArticleTeaser } from './blog.types'

export const BlogContext = createContext({
  articleTeasers: [] as Array<BlogArticleTeaser>,
  articleCategories: [] as Array<BlogArticleCategory>,
})

type BlogContextType = typeof BlogContext extends Context<infer U> ? U : never

export const parseBlogContext = (pageProps: unknown): BlogContextType => {
  const teasers = (pageProps as any)[BLOG_ARTICLE_TEASERS_PAGE_PROP]
  const categories = (pageProps as any)[BLOG_ARTICLE_CATEGORIES_PAGE_PROP]

  return {
    articleTeasers: teasers ?? [],
    articleCategories: categories ?? [],
  }
}

export const useBlogArticleTeasers = (): Array<BlogArticleTeaser> => {
  return useContext(BlogContext).articleTeasers
}

export const useBlogArticleCategories = (): Array<BlogArticleCategory> => {
  return useContext(BlogContext).articleCategories
}
