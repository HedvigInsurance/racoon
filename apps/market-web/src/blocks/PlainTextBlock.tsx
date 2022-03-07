
import {
  ContentWrapper,
  MOBILE_BP_UP,
  SectionWrapper,
} from './blockHelpers'

import React from 'react'
import styled from '@emotion/styled'
import { StoryblokBaseBlock, MarkdownHtmlComponent } from '@/lib/types'

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

  ${MOBILE_BP_UP} {
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
  <SectionWrapper
    colorComponent={color}
    size={size}
    extraStyling={extra_styling}
  >
    <ContentWrapper brandPivot index={index}>
      <InnerContent
        fontSize={font_size}
        dangerouslySetInnerHTML={{ __html: content?.html }}
      />
    </ContentWrapper>
  </SectionWrapper>
)
