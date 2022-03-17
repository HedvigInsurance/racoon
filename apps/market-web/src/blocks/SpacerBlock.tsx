import React from 'react'
import { SectionWrapper } from './blockHelpers'
import { StoryblokBaseBlock } from '@/lib/types'
import styled from '@emotion/styled'

const Spacer = styled(SectionWrapper)`
  padding-bottom: 0 !important;
  z-index: 1;
`

export const SpacerBlock = ({ size, color, extra_styling }: StoryblokBaseBlock) => (
  <Spacer colorComponent={color} size={size} extraStyling={extra_styling} />
)
