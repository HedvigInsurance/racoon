import { ArticleCategoryList } from '@/components/ArticleCategoryList/ArticleCategoryList'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { useBlogArticleCategoryList } from '@/services/blog/blogArticleCategoryList'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<{
  active?: string
}>

export const BlogArticleCategoryListBlock = (props: Props) => {
  const categoryList = useBlogArticleCategoryList()
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
              <ArticleCategoryList.Item key={item.id} href={item.href}>
                {item.name}
              </ArticleCategoryList.Item>
            ),
          )}
        </ArticleCategoryList.Root>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
BlogArticleCategoryListBlock.blockName = 'blogArticleCategoryList'
