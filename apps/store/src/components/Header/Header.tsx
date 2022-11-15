import styled from '@emotion/styled'
import { zIndexes } from '@/utils/zIndex'
import { ShoppingCartMenuItem } from './ShoppingCartMenuItem'
import { useStickyTopMenuOffset } from './useTopMenuStickyOffset'

export const MENU_BAR_HEIGHT = '3.75rem'

export const Wrapper = styled.header<{ topOffset: number }>(({ theme, topOffset = 0 }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  height: MENU_BAR_HEIGHT,
  padding: theme.space[4],
  position: 'sticky',
  top: `${topOffset}px`,
  zIndex: zIndexes.header,
}))

export const Header = () => {
  const { topOffset, navRef } = useStickyTopMenuOffset()
  return (
    <Wrapper topOffset={topOffset} ref={navRef}>
      <ShoppingCartMenuItem />
    </Wrapper>
  )
}
