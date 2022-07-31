import styled from '@emotion/styled'
import Link from 'next/link'
import { useContext } from 'react'
import { PageLink } from '@/lib/PageLink'
import { CartContext } from '@/services/mockCartService'
import { ShoppingBagIcon } from './ShoppingBagIcon'

export const ShoppingCartMenuItem = () => {
  const cartContext = useContext(CartContext)

  if (!cartContext) {
    throw new Error('ProductPage cannot be rendered outside CartContext')
  }

  const { cart } = cartContext

  return (
    <Wrapper>
      <Link href={PageLink.cart()} passHref>
        <StyledLink tabIndex={0} aria-label="shopping cart">
          <ShoppingBagIcon />
        </StyledLink>
      </Link>
      <Counter value={cart.items.length} />
    </Wrapper>
  )
}

const Wrapper = styled.div({
  position: 'relative',
  lineHeight: 0,
})

const StyledLink = styled.a(({ theme }) => ({
  display: 'inline-block',
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.gray900}`,
  },
}))

const StyledCounter = styled.span(({ theme }) => ({
  pointerEvents: 'none',
  position: 'absolute',
  bottom: -6,
  left: -6,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 8,
  height: 8,
  padding: theme.space[2],
  borderRadius: '50%',
  backgroundColor: theme.colors.gray900,
  color: theme.colors.gray200,
  fontSize: theme.fontSizes[0],
}))

type CounterProps = { value: number }

const Counter = ({ value }: CounterProps) => {
  if (value <= 0) return null

  return <StyledCounter>{value}</StyledCounter>
}
