import styled from '@emotion/styled'
import { useMemo } from 'react'
import { theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { useFormatter } from '@/utils/useFormatter'
import { ArticleTeaser } from './ArticleTeaser/ArticleTeaser'
import { BLOG_ARTICLE_LIST_BLOCK } from './blog.constants'
import { useBlogArticleTeasers } from './useBlog'

type Props = SbBaseBlockProps<{
  categories?: Array<string>
}>

export const BlogArticleListBlock = (props: Props) => {
  const teaserList = useBlogArticleTeasers()
  const formatter = useFormatter()

  const filteredTeaserList = useMemo(() => {
    if (!props.blok.categories?.length) return teaserList

    const categorySet = new Set(props.blok.categories)
    return teaserList.filter((item) => {
      return item.categories.some((category) => categorySet.has(category.id))
    })
  }, [teaserList, props.blok.categories])

  return (
    <GridLayout.Root>
      <GridLayout.Content width="1" align="center">
        <List>
          {filteredTeaserList.map((item) => (
            <ArticleTeaser.Root
              key={item.id}
              href={item.href}
              title={item.heading}
              ingress={item.text}
              date={formatter.dateFull(new Date(item.date))}
            >
              <ArticleTeaser.Image {...item.image} alt={item.image.alt} />
            </ArticleTeaser.Root>
          ))}
        </List>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
BlogArticleListBlock.blockName = BLOG_ARTICLE_LIST_BLOCK

const List = styled.div({
  display: 'grid',
  rowGap: theme.space.xxxl,
  columnGap: theme.space.lg,
  gridTemplateColumns: 'repeat(auto-fill, minmax(21rem, 1fr))',
  gridTemplateRows: 'max-content',
})
