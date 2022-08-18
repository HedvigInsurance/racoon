import styled from '@emotion/styled'
import Link from 'next/link'
import { Button, Heading, Space } from 'ui'
import { CartList } from '@/components/CartPage/CartList'
import { PriceBreakdown } from '@/components/PriceBreakdown.tsx/PriceBreakdown'
import { PageLink } from '@/lib/PageLink'
import { CartPageProps } from './CartPageProps.types'

export const CartPage = (props: CartPageProps) => {

  const { products, cost } = props

  return (
    <Space y={3}>
      <div></div>
      <PageHeader>
        <Heading as="h1" variant="standard.24">
          Cart ({products.length})
        </Heading>
      </PageHeader>
      <CartList products={products} />
      <Footer>
        <PriceBreakdown currency="SEK" products={products} cost={cost} />
        <Button fullWidth={true}>
          <Link href={PageLink.cartReview()}>Check Out</Link>
        </Button>
      </Footer>
    </Space>
  )
}

const PageHeader = styled.header(() => ({
  textAlign: 'center',
}))

const Footer = styled.footer(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100%',
  padding: `0 ${theme.space[3]} ${theme.space[6]} ${theme.space[3]}`,
  a: {
    textDecoration: 'none',
  },
}))
