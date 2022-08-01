import Link from 'next/link'
import { Button, Heading, Space } from 'ui'
import { CartList } from '@/components/CartList/CartList'
import { PriceBreakdown } from '@/components/PriceBreakdown.tsx/PriceBreakdown'
import { PageLink } from '@/lib/PageLink'

export const CartPage = () => {
  const products = [
    { name: 'Home Insurance', cost: 250, currency: 'SEK' },
    { name: 'Apartment Insurance', cost: 100, currency: 'SEK' },
  ]
  const cost = { total: 350, subTotal: 250 }

  return (
    <>
      <Heading as="h1" variant="standard.40">
        Cart
      </Heading>
      <Space y={2} />
      <CartList products={products} />
      <PriceBreakdown currency="SEK" products={products} cost={cost} />
      <Button fullWidth={true}>
        <Link href={PageLink.cartReview()}>Check Out</Link>
      </Button>
    </>
  )
}
