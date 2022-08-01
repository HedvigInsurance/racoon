import styled from '@emotion/styled'
import { CartCard } from '@/components/CartCard/CartCard'
import { CartPageProps, ProductData } from '../CartPage/CartPageProps.types'

const CartUl = styled.ul(({ theme }) => ({
  paddingLeft: '0',
  listStyleType: 'none',
  marginTop: theme.space[5],
}))

/**
 * This component shows all items currently in the cart.
 *
 * It can optionally filter by a CmsProduct name to only show relevant products.
 */

type Props = CartPageProps
export const CartList = ({ products }: Props) => {
  // const handleClickRemove = (id: string) => {
  //send BE request to remove item from cart
  // }

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
