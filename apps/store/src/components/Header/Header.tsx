import styled from '@emotion/styled'
import { mq } from 'ui'
import { zIndexes } from '@/utils/zIndex'
import { MENU_BAR_HEIGHT_DESKTOP, MENU_BAR_HEIGHT_MOBILE } from './HeaderStyles'
import { ShoppingCartMenuItem } from './ShoppingCartMenuItem'
import { useStickyTopMenuOffset } from './useTopMenuStickyOffset'

export const Wrapper = styled.header<{ topOffset: number }>(({ theme, topOffset = 0 }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  height: MENU_BAR_HEIGHT_MOBILE,
  padding: theme.space[4],
  position: 'sticky',
  top: `${topOffset}px`,
  zIndex: zIndexes.header,

  [mq.md]: {
    height: MENU_BAR_HEIGHT_DESKTOP,
    backgroundColor: theme.colors.gray100,
  },
}))

type HeaderProps = {
  children: React.ReactNode
}
export const Header = ({ children }: HeaderProps) => {
  const { topOffset, navRef } = useStickyTopMenuOffset()

  return (
    <Wrapper topOffset={topOffset} ref={navRef}>
      {children}
      <ShoppingCartMenuItem />
    </Wrapper>
  )
}
