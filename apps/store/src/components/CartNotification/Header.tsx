import styled from '@emotion/styled'

type HeaderProps = {
  children: string
}

export const Header = ({ children }: HeaderProps) => {
  return (
    <Wrapper>
      <StyledTitle>{children}</StyledTitle>
    </Wrapper>
  )
}

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
