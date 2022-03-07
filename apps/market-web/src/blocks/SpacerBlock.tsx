import React from 'react'
import { SectionWrapper } from './blockHelpers'
import styled from '@emotion/styled'
import { StoryblokBaseBlock } from '@/lib/types'

const Spacer = styled(SectionWrapper)`
  padding-bottom: 0 !important;
  z-index: 1;
`

export const SpacerBlock = ({ size, color, extra_styling }: StoryblokBaseBlock) => (
  <Spacer brandPivot colorComponent={color} size={size} extraStyling={extra_styling} />
)
