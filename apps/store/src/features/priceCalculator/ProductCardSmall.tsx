import { type ReactNode } from 'react'
import { Text, xStack, yStack } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { type ProductData } from '@/components/ProductData/ProductData.types'
import { card } from './ProductCardSmall.css'

type Props = {
  children: ReactNode
  productData: ProductData
  subtitle: string
}

// "Product Card Light" in Figma
// https://www.figma.com/design/5kmmDdh6StpXzbEfr7WevV/Hedvig-UI-Kit?node-id=16269-14623&t=5zDsQbEwaXXTFOxo-0
export function ProductCardSmall({ children, productData, subtitle }: Props) {
  return (
    <div className={card}>
      <div className={xStack({ alignItems: 'center', gap: 'sm' })}>
        <Pillow src={productData.pillowImage.src} size="small" />
        <div className={yStack()}>
          <Text as="span" size="lg">
            {productData.displayNameFull}
          </Text>
          <Text as="span" size="lg" color="textSecondary">
            {subtitle}
          </Text>
        </div>
      </div>
      {children}
    </div>
  )
}
