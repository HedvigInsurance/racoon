'use client'

import styled from '@emotion/styled'
import { mq } from '../../theme'

type SpaceSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type Props = {
  size?: SpaceSize
}

const spaceBlockScale = {
  _: {
    xs: '2rem',
    sm: '3.5rem',
    md: '5rem',
    lg: '6rem',
    xl: '9rem',
  },
  md: {
    xs: '3rem',
    sm: '5rem',
    md: '9rem',
    lg: '12rem',
    xl: '18rem',
  },
} as const

export const Spacer = styled.div<Props>(({ size = 'sm' }) => ({
  height: spaceBlockScale._[size],

  [mq.md]: {
    height: spaceBlockScale.md[size as SpaceSize],
  },
}))
