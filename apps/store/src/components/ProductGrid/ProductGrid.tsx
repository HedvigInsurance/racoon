import { Fragment } from 'react'
import { Space, Text } from 'ui'
import { productGrid } from './ProductGrid.css'

export type ProductGridProps<Item> = {
  title?: string
  items: Array<Item>
  children: (item: Item) => React.ReactNode
}

export const ProductGrid = <ItemType extends { key: string }>({
  title,
  items,
  children,
}: ProductGridProps<ItemType>) => {
  return (
    <Space y={1.5}>
      {title && (
        <Text align="center" color="textSecondary" size="xs" uppercase={true}>
          {title}
        </Text>
      )}
      <div className={productGrid}>
        {items.map((item) => (
          <Fragment key={item.key}>{children(item)}</Fragment>
        ))}
      </div>
    </Space>
  )
}
