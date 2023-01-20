import styled from '@emotion/styled'
import { mq, Space } from 'ui'

export const Root = styled(Space)(({ theme }) => ({
  paddingTop: theme.space.md,

  [mq.lg]: {
    paddingTop: theme.space.xxxl,
  },
}))

export const Header = styled.header(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.md,
  alignItems: 'center',
}))

export const Main = styled.main({
  [mq.sm]: {
    display: 'grid',
    gridTemplateColumns: 'minmax(28rem, 33%)',
    justifyContent: 'center',
  },
})

export const Table = styled.div(({ theme }) => ({
  paddingInline: theme.space.md,
}))

export const Row = styled.div(({ theme }) => ({
  height: '3.5rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  // @TODO: update to "border opaque" color
  borderBottom: `1px solid ${theme.colors.gray300}`,
}))

export const HorizontalList = styled.div(({ theme }) => ({
  paddingBlock: theme.space.md,
  display: 'flex',
  gap: theme.space.xxs,

  paddingInline: theme.space.md,
  overflow: 'auto',
}))
