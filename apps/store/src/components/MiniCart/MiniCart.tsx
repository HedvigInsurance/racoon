import Link from 'next/link'
import { useContext, useState } from 'react'
import { Button, ChevronIcon } from 'ui'
import { PageLink } from '@/lib/PageLink'
import { CartContext } from '@/services/mockCartService'
import { CartList } from '../CartList/CartList'
import { SpaceFlex } from '../SpaceFlex/SpaceFlex'

export const MiniCart = () => {
  const cartContext = useContext(CartContext)
  const [isOpen, setIsOpen] = useState(false)

  if (!cartContext) {
    throw new Error('ProductPage cannot be rendered outside CartContext')
  }

  const { cart } = cartContext

  if (!cart.items.length) {
    return <span>No items in cart!</span>
  }

  return (
    <div>
      <Button size="sm" variant="text" onClick={() => setIsOpen(!isOpen)}>
        <SpaceFlex space={0.5}>
          <span>
            Items in cart: {cart.items.length}, total price: {cart.price}
          </span>
          <ChevronIcon transform={isOpen ? 'rotate(-180)' : 'rotate(0)'} />
        </SpaceFlex>
      </Button>
      {isOpen && (
        <div>
          <CartList showLinks />
          <Link href={PageLink.cart()} passHref>
            Go to cart
          </Link>
        </div>
      )}
    </div>
  )
}
