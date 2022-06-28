import styled from '@emotion/styled'
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
      <Heading variant="l" headingLevel="h1" colorVariant="dark">
        Cart
      </Heading>
      <Space y={2}>
        <CartList showBundles showLinks />

        <p>
          Items in cart: {cart.items.length}, total price: {cart.price}
        </p>

        <div>
          <Link href={PageLink.store()}>Go to shop</Link>
        </div>
      </Space>
    </>
  )
}
