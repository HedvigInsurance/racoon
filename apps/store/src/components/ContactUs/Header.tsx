import styled from '@emotion/styled'
import { Text, HedvigSymbol, theme } from 'ui'

type HeaderProps = {
  CloseBtn: React.ReactElement
}

export const Header = ({ CloseBtn }: HeaderProps) => {
  return (
    <StyledHeader>
      <HedvigSymbol size="24px" />
      <Text as="span">Hedvig</Text>
      {CloseBtn}
    </StyledHeader>
  )
}

const StyledHeader = styled.header({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.xs,
  color: theme.colors.white,
  backgroundColor: theme.colors.black,
  paddingBlock: theme.space.sm,
  paddingInline: theme.space.md,
  borderTopLeftRadius: 'inherit',
  borderTopRightRadius: 'inherit',
})
