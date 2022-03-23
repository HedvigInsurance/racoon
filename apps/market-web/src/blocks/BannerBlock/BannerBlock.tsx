import styled from '@emotion/styled'
import React from 'react'
import { mq } from 'ui'
import { StoryblokBaseBlock, MarkdownHtmlComponent } from '@/services/storyblok/types'
import { CONTENT_MAX_WIDTH_XL, SectionWrapper } from '../blockHelpers'

const BannerContent = styled('div')({
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: '1rem',
  textAlign: 'center',
  ...CONTENT_MAX_WIDTH_XL,

  [mq.md]: {
    padding: '1.25rem',
  },

  '& > *': {
    marginTop: '0',
    marginBottom: '0',
  },
})

export type BannerBlockProps = StoryblokBaseBlock & {
  text: MarkdownHtmlComponent
}

export const BannerBlock = ({ color, extra_styling, text }: BannerBlockProps) => (
  <SectionWrapper colorComponent={color} extraStyling={extra_styling} size="none">
    <BannerContent dangerouslySetInnerHTML={{ __html: text?.html }} />
  </SectionWrapper>
)
