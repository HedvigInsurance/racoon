import Link from 'next/link'
import { useContext } from 'react'
import { Heading, Space } from 'ui'
import { CartList } from '@/components/CartList/CartList'
import { PageLink } from '@/lib/PageLink'
import { CartContext } from '@/services/mockCartService'

export const CartPage = () => {
  const cartContext = useContext(CartContext)

  if (!cartContext) {
    throw new Error('ProductPage cannot be rendered outside CartContext')
  }

  const { cart } = cartContext

  return (
    <>
      <Heading as="h1" variant="standard.40">
        Cart
      </Heading>
      <Space y={2}>
        <CartList showBundles showLinks />

        <p>
          Items in cart: {cart.items.length}, total price: {cart.price}
        </p>

        <footer>
          <Link href={PageLink.cartReview()}>Check Out</Link>
        </footer>

        <div>
          <Link href={PageLink.store()}>Go to shop</Link>
        </div>
      </Space>
    </>
  )
}
