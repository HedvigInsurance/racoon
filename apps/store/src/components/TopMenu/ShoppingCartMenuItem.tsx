import styled from '@emotion/styled'
import Link from 'next/link'
import { PageLink } from '@/lib/PageLink'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { ShoppingBagIcon } from './ShoppingBagIcon'

export const ShoppingCartMenuItem = () => {
  const { data } = useShopSession()
  const cartLineCount = data?.shopSession.cart.lines.length ?? 0

  return (
    <Wrapper>
      <Link href={PageLink.cart()} passHref>
        <StyledLink tabIndex={0} aria-label="shopping cart">
          <ShoppingBagIcon />
        </StyledLink>
      </Link>
      <Counter value={cartLineCount} />
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

type CounterProps = { value: number }

const Counter = ({ value }: CounterProps) => {
  if (value <= 0) return null

  return <StyledCounter>{value}</StyledCounter>
}

const StyledCounter = styled.span(({ theme }) => ({
  pointerEvents: 'none',
  position: 'absolute',
  top: 1,
  right: -6,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 14,
  height: 14,
  borderRadius: '50%',
  backgroundColor: theme.colors.gray900,
  color: theme.colors.gray200,
  fontSize: 10,
  fontWeight: 'bold',
}))
