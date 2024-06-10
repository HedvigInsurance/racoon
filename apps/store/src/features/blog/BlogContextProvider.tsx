'use client'
import type { ReactNode } from 'react'
import type {
  BLOG_ARTICLE_CATEGORIES_PAGE_PROP,
  BLOG_ARTICLE_TEASERS_PAGE_PROP,
} from '@/features/blog/blog.constants'
import type { BlogArticleCategory, BlogArticleTeaser } from '@/features/blog/blog.types'
import { BlogContext, parseBlogContext } from '@/features/blog/useBlog'

type Props = {
  children: ReactNode
  blogPageProps?: BlogPageProps
}

export type BlogPageProps = {
  [BLOG_ARTICLE_CATEGORIES_PAGE_PROP]?: Array<BlogArticleCategory>
  [BLOG_ARTICLE_TEASERS_PAGE_PROP]?: Array<BlogArticleTeaser>
}

export function BlogContextProvider({ blogPageProps, children }: Props) {
  return (
    <BlogContext.Provider value={parseBlogContext(blogPageProps ?? {})}>
      {children}
    </BlogContext.Provider>
  )
}
