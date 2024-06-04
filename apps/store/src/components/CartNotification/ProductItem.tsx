import { Text } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { productItem, productItemTitle } from './ProductItem.css'

export type ProductItemProps = {
  name: string
  price: string
  pillowSrc: string
  description?: string
}

export const ProductItem = ({ name, price, description, pillowSrc }: ProductItemProps) => {
  return (
    <div className={productItem}>
      <Pillow size="small" src={pillowSrc} />
      <div className={productItemTitle}>
        <Text>{name}</Text>
        <Text color="textSecondary">{description}</Text>
      </div>
      <Text>{price}</Text>
    </div>
  )
}
