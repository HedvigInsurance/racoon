'use client'

import isPropValid from '@emotion/is-prop-valid'
import type { StyledOptions } from '@emotion/styled'
import styled from '@emotion/styled'
import { mq, theme } from 'ui'
import { MAX_WIDTH } from './GridLayout.constants'
import type { ContentAlignment, ContentWidth } from './GridLayout.helper'
import { getGridLayout } from './GridLayout.helper'

export const Root = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  columnGap: theme.space.md,
  paddingInline: theme.space.md,

  width: '100%',
  maxWidth: MAX_WIDTH,
  marginInline: 'auto',

  [mq.lg]: {
    paddingInline: theme.space.lg,
  },
})

type ContentProps = {
  width: ContentWidth
  align?: ContentAlignment
}

const elementConfig: StyledOptions = {
  shouldForwardProp: (prop: string) => isPropValid(prop) && prop !== 'width',
}

export const Content = styled(
  'div',
  elementConfig,
)<ContentProps>(({ width, align }) => ({
  gridColumn: '1 / span 12',
  ...getGridLayout(width, align ?? 'left'),
}))
