import styled from '@emotion/styled'
import React from 'react'
import { mq } from 'ui'
import { ContentWrapper, SectionWrapper } from '@/blocks/blockHelpers'
import { FontSizes, Heading } from '@/components/Heading/Heading'
import { TextPosition } from '@/helpers/textPosition'
import { StoryblokBaseBlock } from '@/services/storyblok/types'

type HeadlineBlockProps = StoryblokBaseBlock & {
  text: string
  text_position: TextPosition
  capitalize?: boolean
  use_display_font: boolean
  show_hedvig_wordmark?: boolean
  font_size: FontSizes
  font_size_mobile?: FontSizes
  element: 'h1' | 'h2' | 'h3' | 'h4'
}

const Text = styled.span({
  br: {
    display: 'none',
  },

  [mq.md]: {
    br: {
      display: 'block',
    },
  },
})

const Wordmark = styled.div({
  display: 'inline-flex',
  position: 'absolute',
  marginTop: '0.625rem',
  marginLeft: '0.5rem',

  svg: {
    width: '1.25rem',
    height: '1.25rem',
  },

  [mq.md]: {
    marginTop: '1rem',
    svg: {
      width: '2rem',
      height: '2rem',
    },
  },
})

export const HeadlineBlock = ({
  color,
  index,
  text,
  capitalize = false,
  text_position,
  use_display_font,
  show_hedvig_wordmark,
  extra_styling,
  element,
  font_size,
  font_size_mobile,
}: HeadlineBlockProps) => {
  return (
    <SectionWrapper colorComponent={color} extraStyling={extra_styling} size="none">
      <ContentWrapper contentWidth index={index}>
        <Heading
          as={element}
          textPosition={text_position}
          size={font_size}
          mobileSize={font_size_mobile}
          useDisplayFont={use_display_font}
          capitalize={capitalize}
        >
          <Text
            dangerouslySetInnerHTML={{
              __html: text,
            }}
          />
          {show_hedvig_wordmark && <Wordmark />}
        </Heading>
      </ContentWrapper>
    </SectionWrapper>
  )
}
