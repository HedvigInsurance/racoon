import Link from 'next/link'
import { useContext } from 'react'
import { Button, Space, CrossIcon } from 'ui'
import { PageLink } from '@/lib/PageLink'
import { CartContext } from '@/services/mockCartService'

type CartListProps = {
  filterByProductName?: string
}

/**
 * This component shows all items currently in the cart.
 *
 * It can optionally filter by a CmsProduct name to only show relevant products.
 */
export const CartList = ({ filterByProductName }: CartListProps) => {
  const cartContext = useContext(CartContext)

  if (!cartContext) {
    throw new Error('ProductPage cannot be rendered outside CartContext')
  }

  const { cart, removeItem } = cartContext

  const handleClickRemove = (id: string) => {
    removeItem(id)
  }

  const items = filterByProductName
    ? cart.items.filter((item) => item.cmsProduct.name === filterByProductName)
    : cart.items

  if (items.length === 0) return null

  return (
    <ul>
      <Space y={1}>
        {items.map((item) => (
          <li key={item.id}>
            <Space x={0.5}>
              <Link href={PageLink.product({ id: item.cmsProduct.slug })} passHref>
                {item.cmsProduct.displayName}
              </Link>
              , price: {item.price}
              <Button onClick={() => handleClickRemove(item.id)} size="sm" icon={<CrossIcon />}>
                Remove
              </Button>
            </Space>
          </li>
        ))}
      </Space>
    </ul>
  )
}
