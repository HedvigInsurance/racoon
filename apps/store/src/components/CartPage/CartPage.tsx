import styled from '@emotion/styled'
import Link from 'next/link'
import { Button, Heading, Space } from 'ui'
import { CartList } from '@/components/CartList/CartList'
import { PriceBreakdown } from '@/components/PriceBreakdown.tsx/PriceBreakdown'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { PageLink } from '@/lib/PageLink'

export const CartPage = () => {
  const products = [
    { name: 'Home Insurance', cost: 250, currency: 'SEK' },
    { name: 'Apartment Insurance', cost: 100, currency: 'SEK' },
  ]
  const cost = { total: 350, subTotal: 250 }

  return (
    <Space y={3}>
      <div></div>
      <PageHeader>
        <Heading as="h1" variant="standard.24">
          Cart (2)
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

const PageHeader = styled.header(({ theme }) => ({
  textAlign: 'center',
}))

const Footer = styled.footer(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  width: '100%',
  padding: `0 ${theme.space[3]} ${theme.space[6]} ${theme.space[3]}`,
  a: {
    textDecoration: 'none',
  },
}))
