import {
  BLOG_ARTICLE_CATEGORY_CONTENT_TYPE,
  BLOG_ARTICLE_CATEGORY_LIST_BLOCK,
  BLOG_ARTICLE_CONTENT_TYPE,
  BLOG_ARTICLE_LIST_BLOCK,
} from '@/features/blog/blog.constants'
import { BlogArticleBlock } from './BlogArticleBlock'
import { BlogArticleCategoryBlock } from './BlogArticleCategoryBlock'
import { BlogArticleCategoryListBlock } from './BlogArticleCategoryListBlock'
import { BlogArticleListBlock } from './BlogArticleListBlock/BlogArticleListBlock'

export const blogBlocks = {
  [BLOG_ARTICLE_CONTENT_TYPE]: BlogArticleBlock,
  [BLOG_ARTICLE_CATEGORY_CONTENT_TYPE]: BlogArticleCategoryBlock,
  [BLOG_ARTICLE_CATEGORY_LIST_BLOCK]: BlogArticleCategoryListBlock,
  [BLOG_ARTICLE_LIST_BLOCK]: BlogArticleListBlock,
}
