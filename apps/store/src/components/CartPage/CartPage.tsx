import Link from 'next/link'
import { useContext } from 'react'
import { Heading, Space } from 'ui'
import { CartList } from '@/components/CartList/CartList'
import { PageLink } from '@/lib/PageLink'
import { CartContext } from '@/services/mockCartService'
import { PriceBreakdown } from '../CheckoutPaymentPage/PriceBreakdown'

export const CartPage = () => {
  const cartContext = useContext(CartContext)

  if (!cartContext) {
    throw new Error('ProductPage cannot be rendered outside CartContext')
  }

  const { cart } = cartContext

  const products = [{ name: 'Home Insurance', cost: 250, currency: 'SEK' }, { name: 'Apartment Insurance', cost: 100, currency: 'SEK' }]
  const cost = {total: 350, subTotal: 250}

  return (
    <>
      <Heading as="h1" variant="standard.40">
        Cart
      </Heading>
      <Space y={2}/>
        <CartList products={products}/>
      <PriceBreakdown currency="SEK" products={products} cost={cost}/>


        <footer>
          <Link href={PageLink.cartReview()}>Check Out</Link>
        </footer>

        <div>
          <Link href={PageLink.store()}>Go to shop</Link>
        </div>
    </>
  )
}
