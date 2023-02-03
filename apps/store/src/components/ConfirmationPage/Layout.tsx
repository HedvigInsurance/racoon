import styled from '@emotion/styled'
import { mq, theme } from 'ui'

const Root = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  columnGap: theme.space.md,
  paddingInline: theme.space.md,

  maxWidth: 1920,
  marginInline: 'auto',

  [mq.lg]: {
    paddingInline: theme.space.xl,
  },
})

const Content = styled.div({
  gridColumn: '1 / span 12',

  [mq.md]: {
    gridColumn: '3 / span 8',
  },

  [mq.lg]: {
    gridColumn: '4 / span 6',
  },

  [mq.xl]: {
    gridColumn: '5 / span 4',
  },
})

export const Layout = {
  Root,
  Content,
}
