import styled from '@emotion/styled'
import { StoryblokComponent, storyblokEditable } from '@storyblok/react'
import Link from 'next/link'
import { Heading, Space, Text, mq, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { ArticleTeaser } from './ArticleTeaser/ArticleTeaser'
import { BLOG_ARTICLE_CONTENT_TYPE } from './blog.constants'
import { convertToBlogArticleCategory } from './blog.helpers'
import { type BlogArticleContentType } from './blog.types'

type Props = SbBaseBlockProps<BlogArticleContentType['content']>

export const BlogArticleBlock = (props: Props) => {
  const categories = props.blok.categories.map(convertToBlogArticleCategory)
  const { locale } = useCurrentLocale()

  return (
    <>
      <GridLayout.Root {...storyblokEditable(props.blok)}>
        <GridLayout.Content width={{ base: '1', md: '5/6', lg: '2/3', xl: '1/2' }} align="center">
          <TopPadding />
          <Space y={0.5}>
            <SpaceFlex space={0.25}>
              {categories.map((item) => (
                <Link key={item.id} href={item.href}>
                  <ArticleTeaser.Badge as="span">{item.name}</ArticleTeaser.Badge>
                </Link>
              ))}
            </SpaceFlex>
            <Space y={1.5}>
              <Heading as="h1" variant={{ _: 'serif.32', lg: 'serif.56' }}>
                {props.blok.page_heading}
              </Heading>
              <UppercaseText size="sm" color="textSecondary">
                {formatDate(props.blok.date, locale)}
              </UppercaseText>
            </Space>
          </Space>
        </GridLayout.Content>
      </GridLayout.Root>
      {props.blok.body.map((item) => (
        <StoryblokComponent blok={item} key={item._uid} />
      ))}
    </>
  )
}
BlogArticleBlock.blockName = BLOG_ARTICLE_CONTENT_TYPE

const TopPadding = styled.div({
  height: theme.space.xxl,
  [mq.md]: { height: theme.space.xxxl },
})

const UppercaseText = styled(Text)({
  textTransform: 'uppercase',
})

const formatDate = (date: string, locale = 'sv-SE') => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
