import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { Space, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { useFormatter } from '@/utils/useFormatter'
import { ArticleTeaser } from './ArticleTeaser/ArticleTeaser'
import { BLOG_ARTICLE_LIST_BLOCK } from './blog.constants'
import { useBlogArticleTeasers } from './useBlog'

const INITIAL_VISIBLE_COUNT = 12
const QUERY_PARAM = 'showAll'

type Props = SbBaseBlockProps<{
  categories?: Array<string>
}>

export const BlogArticleListBlock = (props: Props) => {
  const { t } = useTranslation()
  const formatter = useFormatter()

  const teaserList = useBlogArticleTeasers()
  const filteredTeaserList = useMemo(() => {
    if (!props.blok.categories?.length) return teaserList

    const categorySet = new Set(props.blok.categories)
    return teaserList.filter((item) => {
      return item.categories.some((category) => categorySet.has(category.id))
    })
  }, [teaserList, props.blok.categories])

  const router = useRouter()
  const showAll =
    filteredTeaserList.length <= INITIAL_VISIBLE_COUNT || router.query[QUERY_PARAM] === '1'

  const visibleTeaserList = showAll
    ? filteredTeaserList
    : filteredTeaserList.slice(0, INITIAL_VISIBLE_COUNT)

  return (
    <GridLayout.Root>
      <GridLayout.Content width={{ xxl: '5/6' }} align="center">
        <Space y={8}>
          <List>
            {visibleTeaserList.map((item, index) => (
              <ArticleTeaser.Root
                key={item.id}
                href={item.href}
                title={item.heading}
                ingress={item.text}
                date={formatter.dateFull(new Date(item.date))}
              >
                <ArticleTeaser.Image {...item.image} alt={item.image.alt} priority={index < 6} />
              </ArticleTeaser.Root>
            ))}
          </List>

          {!showAll && (
            <ButtonWrapper>
              <InlineButtonLink
                href={{ query: { ...router.query, [QUERY_PARAM]: '1' } }}
                shallow={true}
              >
                {t('BLOG_LOAD_MORE_BUTTON')}
              </InlineButtonLink>
            </ButtonWrapper>
          )}
        </Space>
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

const ButtonWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
})

const InlineButtonLink = styled(ButtonNextLink)({ width: 'auto' })
