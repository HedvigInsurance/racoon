import { type ReactNode } from 'react'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { Text } from 'ui'
import { productGrid } from './ProductGrid.css'

export type ProductGridProps = {
  title?: string
  children: ReactNode
}

export function ProductGrid({ title, children }: ProductGridProps) {
  return (
    <div>
      {title && (
        <Text
          align="center"
          color="textSecondary"
          size="xs"
          uppercase={true}
          className={sprinkles({ marginTop: 'lg' })}
        >
          {title}
        </Text>
      )}
      <div className={productGrid}>{children}</div>
    </div>
  )
}
