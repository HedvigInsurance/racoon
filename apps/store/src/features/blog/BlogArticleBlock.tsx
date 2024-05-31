'use client'

import styled from '@emotion/styled'
import { StoryblokComponent, storyblokEditable } from '@storyblok/react'
import Link from 'next/link'
import { Badge, Heading, mq, Space, Text, theme } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { makeAbsolute } from '@/services/storyblok/Storyblok.helpers'
import { useFormatter } from '@/utils/useFormatter'
import { BLOG_ARTICLE_CONTENT_TYPE } from './blog.constants'
import { convertToBlogArticleCategory } from './blog.helpers'
import type { BlogArticleCategory } from './blog.types'
import { type BlogArticleContentType } from './blog.types'

type Props = SbBaseBlockProps<BlogArticleContentType['content']>

export const BlogArticleBlock = (props: Props) => {
  const formatter = useFormatter()
  const categories = getCategories(props.blok.categories)

  return (
    <>
      <GridLayout.Root {...storyblokEditable(props.blok)}>
        <GridLayout.Content width={{ base: '1', md: '5/6', lg: '2/3', xl: '1/2' }} align="center">
          <TopPadding />
          <Space y={0.5}>
            {categories.length > 0 && (
              <SpaceFlex space={0.25}>
                {categories.map((item) => (
                  <Link key={item.id} href={makeAbsolute(item.href)}>
                    <Badge as="span">{item.name}</Badge>
                  </Link>
                ))}
              </SpaceFlex>
            )}
            <Space y={1.5}>
              <Heading as="h1" variant={{ _: 'serif.32', lg: 'serif.56' }}>
                {props.blok.page_heading}
              </Heading>
              <UppercaseText size="sm" color="textSecondary">
                {formatter.dateFull(new Date(props.blok.date))}
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

const getCategories = (categories: BlogArticleContentType['content']['categories']) => {
  return categories
    .map((item) => (typeof item === 'string' ? null : convertToBlogArticleCategory(item)))
    .filter(isBlogArticleCategory)
}

const isBlogArticleCategory = (item: BlogArticleCategory | null): item is BlogArticleCategory => {
  return item !== null
}
