import styled from '@emotion/styled'
import Link from 'next/link'
import { theme } from 'ui'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { PageLink } from '@/utils/PageLink'
import { ShoppingBagIcon } from './ShoppingBagIcon'

export const ShoppingCartMenuItem = () => {
  const { shopSession } = useShopSession()
  const cartLineCount = shopSession?.cart.entries.length ?? 0

  return (
    <Wrapper>
      <StyledLink href={PageLink.cart()} aria-label="shopping cart">
        <ShoppingBagIcon count={cartLineCount} />
      </StyledLink>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  position: 'relative',
  lineHeight: 0,
})

const StyledLink = styled(Link)({
  display: 'inline-block',
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.gray900}`,
  },
})
