import styled from '@emotion/styled'
import React from 'react'
import { StoryblokBaseBlock } from '@/services/storyblok/types'
import { SectionWrapper } from './blockHelpers'

const Spacer = styled(SectionWrapper)`
  z-index: 1;
  && {
    padding-bottom: 0;
  }
`

export const SpacerBlock = ({ size, color, extra_styling }: StoryblokBaseBlock) => (
  <Spacer colorComponent={color} size={size} extraStyling={extra_styling} />
)
