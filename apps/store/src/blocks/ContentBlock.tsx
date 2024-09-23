'use client'
import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { type StoryblokRichTextNode } from '@storyblok/richtext'
import { useMemo } from 'react'
import { Space, Badge, mq, theme } from 'ui'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { renderRichTextToString } from './RichTextBlock/richTextReactRenderer'

type Alignment = 'left' | 'center' | 'right' | 'justify'

export type Props = SbBaseBlockProps<{
  body: StoryblokRichTextNode
  heading?: string
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  alignment?: Alignment
}>

export const ContentBlock = ({ blok }: Props) => {
  const contentHtml = useMemo(() => renderRichTextToString(blok.body), [blok.body])

  return (
    <Wrapper {...storyblokEditable(blok)} y={1}>
      {blok.heading && <Badge as={blok.headingLevel ?? 'h2'}>{blok.heading}</Badge>}
      <TextWrapper alignment={blok.alignment ?? 'left'}>
        <Space y={1} dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </TextWrapper>
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  maxWidth: '37.5rem',
  paddingLeft: theme.space.md,
  paddingRight: theme.space.md,
})

const TextWrapper = styled.div<{ alignment: Alignment }>(({ alignment }) => ({
  fontSize: theme.fontSizes.xl,
  textAlign: alignment,

  [mq.md]: {
    fontSize: theme.fontSizes.xxl,
  },
}))
