import styled from '@emotion/styled'
import { CartCard } from '@/components/CartCard/CartCard'
import { CartPageProps } from './CartPageProps.types'

type Props = Pick<CartPageProps, 'products'>
export const CartList = ({ products }: Props) => {
  return (
    <StyledCartList>
      {products.map((item, id) => (
        <li key={id}>
          <CartCard title={item.name} price={item.cost} currency={item.currency} />
        </li>
      ))}
    </StyledCartList>
  )
}

const StyledCartList = styled.ul({
  padding: 0,
  listStyleType: 'none',
  width: '100%',
})
