import styled from '@emotion/styled'
import { theme } from 'ui'
import { ArticleTeaser } from '@/components/ArticleTeaser/ArticleTeaser'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { useBlogArticleTeaserList } from '@/services/blog/blogArticleTeaserList'
import { useFormatter } from '@/utils/useFormatter'

export const BlogArticleListBlock = () => {
  const teaserList = useBlogArticleTeaserList()
  const formatter = useFormatter()

  return (
    <GridLayout.Root>
      <GridLayout.Content width="1" align="center">
        <List>
          {teaserList.map((item) => (
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
                  <ArticleTeaser.Badge key={category}>{category}</ArticleTeaser.Badge>
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
