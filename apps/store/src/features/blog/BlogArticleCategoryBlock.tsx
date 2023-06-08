import { type ComponentProps } from 'react'
import { PageBlock } from '@/blocks/PageBlock'
import { BLOG_ARTICLE_CATEGORY_CONTENT_TYPE } from './blog.constants'

export const BlogArticleCategoryBlock = (props: ComponentProps<typeof PageBlock>) => {
  return <PageBlock {...props} />
}
BlogArticleCategoryBlock.blockName = BLOG_ARTICLE_CATEGORY_CONTENT_TYPE
