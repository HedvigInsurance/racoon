import styled from '@emotion/styled'
import { mq } from 'ui'
import { zIndexes } from '@/utils/zIndex'
import { MENU_BAR_HEIGHT_DESKTOP, MENU_BAR_HEIGHT_MOBILE } from './HeaderStyles'
import { ShoppingCartMenuItem } from './ShoppingCartMenuItem'

export const Wrapper = styled.header(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  height: MENU_BAR_HEIGHT_MOBILE,
  padding: theme.space[4],
  position: 'sticky',
  zIndex: zIndexes.header,

  [mq.md]: {
    height: MENU_BAR_HEIGHT_DESKTOP,
    backgroundColor: theme.colors.light,
    position: 'sticky',
    top: 0,
  },
}))

type HeaderProps = {
  children: React.ReactNode
}
export const Header = ({ children }: HeaderProps) => {
  return (
    <Wrapper>
      {children}
      <ShoppingCartMenuItem />
    </Wrapper>
  )
}
