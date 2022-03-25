import styled from '@emotion/styled'
import React from 'react'
import { mq } from 'ui'
import { MarkdownHtmlComponent, StoryblokBaseBlock } from '@/services/storyblok/types'
import { ContentWrapper, SectionWrapper } from './blockHelpers'

type ParagraphFontSize = 'sm' | 'md' | 'lg' | 'xl'

const paragraphSizeMap: Record<ParagraphFontSize, string> = {
  sm: '1rem', // 16px
  md: '1.125rem', // 18px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
}

const InnerContent = styled.div<{ fontSize: ParagraphFontSize }>`
  max-width: 44rem;
  margin-left: auto;
  margin-right: auto;

  ${mq.xs} {
    font-size: ${(props) => paragraphSizeMap[props.fontSize]};
  }
`

type PlainTextBlockProps = StoryblokBaseBlock & {
  content: MarkdownHtmlComponent
  font_size: ParagraphFontSize
}

export const PlainTextBlock: React.FunctionComponent<PlainTextBlockProps> = ({
  color,
  size,
  extra_styling,
  font_size = 'sm',
  content,
  index,
}) => (
  <SectionWrapper colorComponent={color} size={size} extraStyling={extra_styling}>
    <ContentWrapper contentWidth index={index}>
      <InnerContent fontSize={font_size} dangerouslySetInnerHTML={{ __html: content.html }} />
    </ContentWrapper>
  </SectionWrapper>
)
