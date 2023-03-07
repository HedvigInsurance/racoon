import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { mq, theme } from 'ui'
import { ContentAlignment, getGridLayout, ContentWidth } from './GridLayout.helper'

export const TEXT_CONTENT_MAX_WIDTH = '37.5rem' // 600px
export const MAX_WIDTH = '120rem' // 1920px

const Root = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  columnGap: theme.space.md,
  paddingInline: theme.space.md,

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

const elementConfig = {
  shouldForwardProp: (prop: string) => isPropValid(prop) && prop !== 'width',
}

const Content = styled(
  'div',
  elementConfig,
)<ContentProps>(({ width, align }) => ({
  gridColumn: '1 / span 12',
  ...getGridLayout(width, align ?? 'left'),
}))

export const GridLayout = {
  Root,
  Content,
}
