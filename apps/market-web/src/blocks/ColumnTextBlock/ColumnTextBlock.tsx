import styled from '@emotion/styled'
import React from 'react'
import { mq } from 'ui'
import { MarkdownHtmlComponent, StoryblokBaseBlock } from '@/services/storyblok/types'
import { ContentWrapper, SectionWrapper } from '../blockHelpers'

const ColumnContentWrapper = styled(ContentWrapper)({
  display: 'flex',
  flexWrap: 'wrap',
})

const Column = styled.div({
  width: '100%',
  '&:not(:last-child)': {
    paddingBottom: '1rem',
  },

  [mq.xs]: {
    width: '50%',
    paddingBottom: 0,

    '&:first-child': {
      paddingRight: '1rem',
    },

    '&:last-child': {
      paddingLeft: '1rem',
    },
  },
})

type ColumnTextBlockProps = StoryblokBaseBlock & {
  text_one: MarkdownHtmlComponent
  text_two: MarkdownHtmlComponent
}

export const ColumnTextBlock = ({
  color,
  extra_styling,
  index,
  text_one,
  text_two,
}: ColumnTextBlockProps) => (
  <SectionWrapper colorComponent={color} extraStyling={extra_styling} size="none">
    <ColumnContentWrapper index={index} contentWidth>
      <Column dangerouslySetInnerHTML={{ __html: text_one?.html }} />
      <Column dangerouslySetInnerHTML={{ __html: text_two?.html }} />
    </ColumnContentWrapper>
  </SectionWrapper>
)
