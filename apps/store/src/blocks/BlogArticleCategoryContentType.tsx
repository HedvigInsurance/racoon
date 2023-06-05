import { type ComponentProps } from 'react'
import { PageBlock } from './PageBlock'

export const BlogArticleCategoryContentType = (props: ComponentProps<typeof PageBlock>) => {
  return <PageBlock {...props} />
}
BlogArticleCategoryContentType.blockName = 'blog-article-category'
