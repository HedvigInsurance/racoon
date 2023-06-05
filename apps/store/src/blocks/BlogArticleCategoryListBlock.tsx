import { ArticleCategoryList } from '@/components/ArticleCategoryList/ArticleCategoryList'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { useBlogArticleCategoryList } from '@/services/blog/blogArticleCategoryList'

export const BlogArticleCategoryListBlock = () => {
  const categoryList = useBlogArticleCategoryList()

  return (
    <GridLayout.Root>
      <GridLayout.Content width="1" align="center">
        <ArticleCategoryList.Root>
          <ArticleCategoryList.ActiveItem>Alla artiklar</ArticleCategoryList.ActiveItem>
          {categoryList.map((item) => (
            <ArticleCategoryList.Item key={item.id} href={item.href}>
              {item.name}
            </ArticleCategoryList.Item>
          ))}
        </ArticleCategoryList.Root>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
BlogArticleCategoryListBlock.blockName = 'blogArticleCategoryList'
