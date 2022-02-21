import { BaseBlockProps } from './BaseBlockProps'
import React from 'react'
import { SectionWrapper } from './blockHelpers'
import styled from '@emotion/styled'

const Spacer = styled(SectionWrapper)`
  padding-bottom: 0 !important;
  z-index: 1;
`

export const SpacerBlock = ({ size, color, extra_styling }: BaseBlockProps) => (
  <Spacer brandPivot colorComponent={color} size={size} extraStyling={extra_styling} />
)
