import styled from '@emotion/styled'
import Link from 'next/link'
import { FormEvent, useCallback } from 'react'
import { Button, Heading, Space } from 'ui'
import { CartCard } from '@/components/CartCard/CartCard'
import { PriceBreakdown } from '@/components/PriceBreakdown.tsx/PriceBreakdown'
import { MENU_BAR_HEIGHT } from '@/components/TopMenu/TopMenu'
import { PageLink } from '@/lib/PageLink'
import { useCartLinesRemoveMutation } from '@/services/apollo/generated'
import { CartPageProps } from './CartPageProps.types'

export const CartPage = ({ cartId, products, cost }: CartPageProps) => {
  const [removeLineItem, { loading }] = useCartLinesRemoveMutation({
    refetchQueries: 'active',
    awaitRefetchQueries: true,
  })

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>, lineItemId: string) => {
      event.preventDefault()
      await removeLineItem({ variables: { lineItemId, cartId } })
    },
    [removeLineItem, cartId],
  )

  if (products.length === 0) {
    return <EmptyState />
  }

  return (
    <Wrapper>
      <Space y={3}>
        <StyledHeading as="h1" variant="standard.24">
          Cart ({products.length})
        </StyledHeading>
        <ProductList as="ul" y={1.5}>
          {products.map((item) => (
            <li key={item.id}>
              <CartCard
                title={item.name}
                price={item.cost}
                currency={item.currency}
                onSubmit={(event) => handleSubmit(event, item.id)}
                loading={loading}
              />
            </li>
          ))}
        </ProductList>
        <Footer>
          <Space y={1.5}>
            <PriceBreakdown currency="SEK" products={products} cost={cost} />
            <Button fullWidth>
              <Link href={PageLink.checkout()}>Check Out</Link>
            </Button>
          </Space>
        </Footer>
      </Space>
    </Wrapper>
  )
}

const EmptyState = () => {
  return (
    <Wrapper>
      <Space y={3}>
        <StyledHeading as="h1" variant="standard.24">
          Cart (0)
        </StyledHeading>
        <CenteredParagraph>Your cart is empty.</CenteredParagraph>
        <Footer>
          <Button fullWidth>
            <Link href={PageLink.store()}>Go to Store</Link>
          </Button>
        </Footer>
      </Space>
    </Wrapper>
  )
}

const Wrapper = styled.div(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
  paddingTop: MENU_BAR_HEIGHT,
}))

const StyledHeading = styled(Heading)({ textAlign: 'center' })
const CenteredParagraph = styled.p({ textAlign: 'center' })

const ProductList = styled(Space)({
  padding: 0,
  listStyleType: 'none',
  width: '100%',
})

const Footer = styled.footer(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  padding: `0 ${theme.space[3]} ${theme.space[6]} ${theme.space[3]}`,
  a: {
    textDecoration: 'none',
  },
}))
