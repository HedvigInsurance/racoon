import styled from '@emotion/styled'
import { CheckCircleIcon } from './CheckCircleIcon'

const ICON_SIZE = '2.5rem'

export const Root = styled.ul(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingRight: theme.space[4],
}))

export const Item = styled.li(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: theme.space[2],
}))

export const Icon = () => {
  return (
    <IconWrapper>
      <CheckCircleIcon size={ICON_SIZE} strokeWidth={1.5} />
    </IconWrapper>
  )
}

const IconWrapper = styled.div(({ theme }) => ({
  paddingTop: theme.space[1],
  paddingBottom: theme.space[1],
}))

export const Separator = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  alignSelf: 'stretch',
})

export const Connector = styled.div(({ theme }) => ({
  width: 2,
  backgroundColor: theme.colors.gray900,
  borderRadius: 1,
  flexGrow: 1,
}))

export const Content = styled.div(({ theme }) => ({
  flex: 1,
  paddingTop: theme.space[3],
  paddingBottom: theme.space[3],
}))
