'use client'

import * as GridLayout from '@/components/GridLayout/GridLayout'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { makeAbsolute } from '@/services/storyblok/Storyblok.helpers'
import { ArticleCategoryList } from './ArticleCategoryList/ArticleCategoryList'
import { BLOG_ARTICLE_CATEGORY_LIST_BLOCK } from './blog.constants'
import { useBlogArticleCategories } from './useBlog'

type Props = SbBaseBlockProps<{
  active?: string
}>

export const BlogArticleCategoryListBlock = (props: Props) => {
  const categoryList = useBlogArticleCategories()
  const activeCategoryId = props.blok.active ?? 'all'

  return (
    <GridLayout.Root>
      <GridLayout.Content width="1" align="center">
        <ArticleCategoryList.Root>
          {categoryList.map((item) =>
            item.id === activeCategoryId ? (
              <ArticleCategoryList.ActiveItem key={item.id}>
                {item.name}
              </ArticleCategoryList.ActiveItem>
            ) : (
              <ArticleCategoryList.Item key={item.id} href={makeAbsolute(item.href)}>
                {item.name}
              </ArticleCategoryList.Item>
            ),
          )}
        </ArticleCategoryList.Root>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
BlogArticleCategoryListBlock.blockName = BLOG_ARTICLE_CATEGORY_LIST_BLOCK
