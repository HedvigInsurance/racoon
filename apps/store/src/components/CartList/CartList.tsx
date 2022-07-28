import styled from '@emotion/styled'
import { Space } from 'ui'
import { CartCard } from '../CartCard/CartCard'
import { ProductData } from '../CheckoutPaymentPage/CheckoutPaymentPage.types'

const CartUl = styled.ul(({theme}) => ({
  paddingLeft: '0',
  listStyleType: 'none',
  marginTop: theme.space[5]
}))

/**
 * This component shows all items currently in the cart.
 *
 * It can optionally filter by a CmsProduct name to only show relevant products.
 */
export const CartList = ( {products} : Array<ProductData>) => {
  console.log(products)
  const handleClickRemove = (id: string) => {
    //send BE request to remove item from cart
  }


  return (
    <CartUl>
      {products.map((item: ProductData, id: number) => (
        <li key={id}>
            <CartCard title={item.name} price={item.cost} currency={item.currency} />
        </li>
      ))}
    </CartUl>
  )
}
