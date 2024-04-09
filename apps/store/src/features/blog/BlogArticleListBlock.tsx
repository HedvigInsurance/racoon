'use client'

import styled from '@emotion/styled'
import { usePathname, useSearchParams } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { Space, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { getImgSrc, makeAbsolute } from '@/services/storyblok/Storyblok.helpers'
import { useFormatter } from '@/utils/useFormatter'
import { ArticleTeaser } from './ArticleTeaser/ArticleTeaser'
import { BLOG_ARTICLE_LIST_BLOCK } from './blog.constants'
import { useBlogArticleTeasers } from './useBlog'

const SHOW_ALL_QUERY_PARAM = 'showAll'

type Props = SbBaseBlockProps<{
  categories?: Array<string>
  initiallyVisibleCount?: number
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

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initiallyVisibleCount = props.blok.initiallyVisibleCount ?? 12
  const showAll =
    filteredTeaserList.length <= initiallyVisibleCount ||
    searchParams?.has(SHOW_ALL_QUERY_PARAM, '1')

  const visibleTeaserList = showAll
    ? filteredTeaserList
    : filteredTeaserList.slice(0, initiallyVisibleCount)

  return (
    <GridLayout.Root>
      <GridLayout.Content width={{ xxl: '5/6' }} align="center">
        <Space y={8}>
          <List>
            {visibleTeaserList.map((item, index) => (
              <ArticleTeaser.Root
                key={item.id}
                href={makeAbsolute(item.href)}
                title={item.heading}
                ingress={item.text}
                date={formatter.dateFull(new Date(item.date))}
              >
                <ArticleTeaser.Image
                  {...item.image}
                  alt={item.image.alt}
                  src={getImgSrc(item.image.src)}
                  priority={index < 6}
                />
              </ArticleTeaser.Root>
            ))}
          </List>

          {!showAll && (
            <ButtonWrapper>
              <InlineButtonLink
                href={`${pathname}?${SHOW_ALL_QUERY_PARAM}=1`}
                shallow={true}
                scroll={false}
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
