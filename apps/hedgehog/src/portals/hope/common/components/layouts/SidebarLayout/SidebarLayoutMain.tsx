import styled from '@emotion/styled'
import { colorsV3 } from '@hedviginsurance/brand'

export const SidebarLayoutMain = styled.div<{ dark: boolean }>`
  background-color: ${({ dark, theme }) =>
    dark ? colorsV3.gray900 : theme.background};
  color: ${({ theme }) => theme.foreground};
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 100%;

  &::-webkit-scrollbar {
    appearance: none;
    width: 0;
    display: none;
  }
`
