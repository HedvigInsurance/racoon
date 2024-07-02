import { Text, tokens } from 'ui'
import { cartCount, iconWrapper } from './ShoppingCartMenuItem.css'

export type ShoppingBagIconProps = {
  count: number
}

export const ShoppingBagIcon = ({ count }: ShoppingBagIconProps) => {
  const hasItemsInCart = count > 0

  return (
    <>
      {hasItemsInCart ? (
        <div className={iconWrapper}>
          <ShoppingBagIconGreen />
          <Text className={cartCount} as="span" size="md">
            {count}
          </Text>
        </div>
      ) : (
        <div className={iconWrapper}>
          <ShoppingBagIconLight />
          <Text className={cartCount} size="md">
            {count}
          </Text>
        </div>
      )}
    </>
  )
}

const ShoppingBagIconLight = () => {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 16C0 10.3995 0 7.59921 1.08993 5.46009C2.04867 3.57847 3.57847 2.04867 5.46009 1.08993C7.59921 0 10.3995 0 16 0H24C29.6005 0 32.4008 0 34.5399 1.08993C36.4215 2.04867 37.9513 3.57847 38.9101 5.46009C40 7.59921 40 10.3995 40 16V24C40 29.6005 40 32.4008 38.9101 34.5399C37.9513 36.4215 36.4215 37.9513 34.5399 38.9101C32.4008 40 29.6005 40 24 40H16C10.3995 40 7.59921 40 5.46009 38.9101C3.57847 37.9513 2.04867 36.4215 1.08993 34.5399C0 32.4008 0 29.6005 0 24V16Z"
        fill={tokens.colors.grayTranslucent200}
      />
    </svg>
  )
}

const ShoppingBagIconGreen = () => {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 16C0 10.3995 0 7.59921 1.08993 5.46009C2.04867 3.57847 3.57847 2.04867 5.46009 1.08993C7.59921 0 10.3995 0 16 0H24C29.6005 0 32.4008 0 34.5399 1.08993C36.4215 2.04867 37.9513 3.57847 38.9101 5.46009C40 7.59921 40 10.3995 40 16V24C40 29.6005 40 32.4008 38.9101 34.5399C37.9513 36.4215 36.4215 37.9513 34.5399 38.9101C32.4008 40 29.6005 40 24 40H16C10.3995 40 7.59921 40 5.46009 38.9101C3.57847 37.9513 2.04867 36.4215 1.08993 34.5399C0 32.4008 0 29.6005 0 24V16Z"
        fill={tokens.colors.green100}
      />
    </svg>
  )
}
