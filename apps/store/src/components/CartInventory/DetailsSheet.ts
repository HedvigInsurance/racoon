import styled from '@emotion/styled'
import { mq, Space, theme } from 'ui'

export const Root = styled(Space)({
  paddingTop: theme.space.md,
  // Clear dialog footer
  paddingBottom: theme.space[10],

  [mq.lg]: {
    paddingTop: theme.space.xxxl,
  },
})

export const Header = styled.header({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.md,
  alignItems: 'center',
})

export const Table = styled.div({
  paddingInline: theme.space.md,
})

export const Row = styled.div({
  height: '3.5rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid hsla(0, 0%, 7%, 0.1)',
})

export const HorizontalList = styled.div({
  paddingBlock: theme.space.md,
  display: 'flex',
  gap: theme.space.xxs,

  paddingInline: theme.space.md,
  overflow: 'auto',

  marginRight: `calc(${theme.space.md} * -1)`,
  [mq.sm]: { marginRight: 0 },
})
