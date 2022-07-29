import styled from '@emotion/styled'
import Link from 'next/link'
import { useContext } from 'react'
import { Button, Space, CrossIcon } from 'ui'
import { Text } from '@/components/Text/Text'
import { PageLink } from '@/lib/PageLink'
import { CartContext } from '@/services/mockCartService'
import { ProductNames } from '@/services/mockProductService'

const BundleWrapper = styled.div({
  marginLeft: '0.5rem',
})

type CartListProps = {
  filterByProductName?: ProductNames
  showBundles?: boolean
  showLinks?: boolean
}

/**
 * This component shows all items currently in the cart.
 *
 * It can optionally filter by a CmsProduct name to only show relevant products.
 */
export const CartList = ({ filterByProductName, showBundles, showLinks }: CartListProps) => {
  const cartContext = useContext(CartContext)

  if (!cartContext) {
    throw new Error('ProductPage cannot be rendered outside CartContext')
  }

  const { cart, removeItem } = cartContext

  const handleClickRemove = (id: string) => {
    removeItem(id)
  }

  const items = filterByProductName
    ? cart.items.filter((item) => item.product.name === filterByProductName)
    : cart.items

  if (items.length === 0) return null

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <Space x={0.5}>
            <span>
              {showLinks ? (
                <Link href={PageLink.product({ slug: item.product.slug })}>
                  {item.product.displayName}
                </Link>
              ) : (
                <span>{item.product.displayName}</span>
              )}
              , price: {item.price}
            </span>
            <Button
              onClick={() => handleClickRemove(item.id)}
              size="sm"
              variant="text"
              icon={<CrossIcon />}
            ></Button>
          </Space>
          {item.product.insurances.length > 1 && showBundles && (
            <BundleWrapper>
              <Text size="s">
                Included in this bundle:
                <ul>
                  {item.product.insurances.map((insurance) => (
                    <li key={insurance.name}>{insurance.displayName}</li>
                  ))}
                </ul>
              </Text>
            </BundleWrapper>
          )}
        </li>
      ))}
    </ul>
  )
}
