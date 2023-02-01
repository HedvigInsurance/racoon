import styled from '@emotion/styled'
import { theme } from 'ui'
import { CheckCircleIcon } from './CheckCircleIcon'

const ICON_SIZE = '2.5rem'

export const Root = styled.ul({
  display: 'flex',
  flexDirection: 'column',
  paddingRight: theme.space.md,
})

export const Item = styled.li({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xs,
})

export const Icon = () => {
  return (
    <IconWrapper>
      <CheckCircleIcon size={ICON_SIZE} strokeWidth={1.5} />
    </IconWrapper>
  )
}

const IconWrapper = styled.div({
  paddingTop: theme.space.xxs,
  paddingBottom: theme.space.xxs,
})

export const Separator = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  alignSelf: 'stretch',
})

export const Connector = styled.div({
  width: 2,
  backgroundColor: theme.colors.gray900,
  borderRadius: 1,
  flexGrow: 1,
})

export const Content = styled.div({
  flex: 1,
  paddingTop: theme.space.sm,
  paddingBottom: theme.space.sm,
})
