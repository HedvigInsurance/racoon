import styled from '@emotion/styled'
import React from 'react'

type HeaderProps = {
  children: string
}

export const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  ({ children }, forwardedRef) => {
    return (
      <Wrapper ref={forwardedRef}>
        <StyledTitle>{children}</StyledTitle>
      </Wrapper>
    )
  },
)
Header.displayName = 'Header'

const ROW_HEIGHT = '4.5rem'

const Wrapper = styled.header(() => ({
  height: ROW_HEIGHT,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledTitle = styled.h2(({ theme }) => ({
  color: theme.colors.gray900,
  fontSize: theme.fontSizes.body,
}))
