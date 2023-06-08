import styled from '@emotion/styled'
import { StoryblokComponent, renderRichText, storyblokEditable } from '@storyblok/react'
import Link from 'next/link'
import { useMemo } from 'react'
import { Heading, Space, Text } from 'ui'
import { ArticleTeaser } from '@/components/ArticleTeaser/ArticleTeaser'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { BlogArticleStory, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { useFormatter } from '@/utils/useFormatter'
import { richTextStyles } from './RichTextBlock/RichTextBlock.styles'

type Props = SbBaseBlockProps<BlogArticleStory['content']>

export const BlogArticleContentType = (props: Props) => {
  const formatter = useFormatter()
  const contentHtml = useMemo(() => renderRichText(props.blok.content), [props.blok.content])

  return (
    <>
      <GridLayout.Root {...storyblokEditable(props.blok)}>
        <GridLayout.Content width={{ lg: '2/3', xl: '1/2', xxl: '1/3' }} align="center">
          <Space y={1}>
            <SpaceFlex space={0.25}>
              {props.blok.categories.map((item) => (
                <Link key={item.uuid} href={item.full_slug}>
                  <ArticleTeaser.Badge>{item.name}</ArticleTeaser.Badge>
                </Link>
              ))}
            </SpaceFlex>
            <Heading as="h1" variant={{ _: 'serif.32', lg: 'serif.48' }}>
              {props.blok.page_heading}
            </Heading>
            <Text size="sm" color="textSecondary">
              {formatter.fromNow(new Date(props.blok.date))}
            </Text>
          </Space>
          <RichTextContent dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </GridLayout.Content>
      </GridLayout.Root>
      {props.blok.body.map((item) => (
        <StoryblokComponent blok={item} key={item._uid} />
      ))}
    </>
  )
}
BlogArticleContentType.blockName = 'blog-article'

const RichTextContent = styled.div(richTextStyles)
