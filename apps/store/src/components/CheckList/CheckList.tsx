import styled from '@emotion/styled'
import type { PropsWithChildren } from 'react'
import { CheckIcon } from 'ui/src/icons/CheckIcon'
import { theme } from 'ui/src/theme/theme'

export const Root = styled.ul({
  padding: 0,
})

export const Item = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <StyledItem>
      <IconWrapper>
        <CheckIcon size="1.5rem" />
      </IconWrapper>
      <Content>{children}</Content>
    </StyledItem>
  )
}

const StyledItem = styled.li({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xs,
})

const IconWrapper = styled.div({ flexShrink: 0 })
const Content = styled.div({ flex: 1 })
