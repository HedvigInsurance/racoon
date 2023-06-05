import styled from '@emotion/styled'
import { useMemo } from 'react'
import { theme } from 'ui'
import { ArticleTeaser } from '@/components/ArticleTeaser/ArticleTeaser'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { useBlogArticleTeaserList } from '@/services/blog/blogArticleTeaserList'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { useFormatter } from '@/utils/useFormatter'

type Props = SbBaseBlockProps<{
  categories?: Array<string>
}>

export const BlogArticleListBlock = (props: Props) => {
  const teaserList = useBlogArticleTeaserList()
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
            <ArticleTeaser.Root key={item.id}>
              <ArticleTeaser.Image {...item.image} alt={item.image.alt} />
              <ArticleTeaser.Content
                href="/se"
                title={item.heading}
                date={formatter.fromNow(new Date(item.date))}
              >
                {item.text}
              </ArticleTeaser.Content>
              <ArticleTeaser.BadgeList>
                {item.categories.map((category) => (
                  <ArticleTeaser.Badge key={category.id}>{category.name}</ArticleTeaser.Badge>
                ))}
              </ArticleTeaser.BadgeList>
            </ArticleTeaser.Root>
          ))}
        </List>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
BlogArticleListBlock.blockName = 'blogArticleList'

const List = styled.div({
  display: 'grid',
  rowGap: theme.space.xxxl,
  columnGap: theme.space.lg,
  gridTemplateColumns: 'repeat(auto-fill, minmax(21rem, 1fr))',
  gridTemplateRows: 'max-content',
})
