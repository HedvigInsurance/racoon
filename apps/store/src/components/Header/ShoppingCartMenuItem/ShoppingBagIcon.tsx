import { Text } from 'ui'
import { ShoppingBagIconSvg } from './ShoppingBagIconSvg'
import {
  cartCount,
  iconWrapper,
  shoppingBagIconGreen,
  shoppingBagIconLight,
} from './ShoppingCartMenuItem.css'

export type ShoppingBagIconProps = {
  count?: number
}

export const ShoppingBagIcon = ({ count }: ShoppingBagIconProps) => {
  const hasItemsInCart = count && count > 0

  return (
    <div className={iconWrapper}>
      <ShoppingBagIconSvg
        className={hasItemsInCart ? shoppingBagIconGreen : shoppingBagIconLight}
      />
      <Text className={cartCount} as="span" size="md">
        {count}
      </Text>
    </div>
  )
}
