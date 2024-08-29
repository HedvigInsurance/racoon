import { type ReactNode } from 'react'
import { Text, xStack, yStack } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { card } from './ProductCardSmall.css'

type Props = {
  children: ReactNode
  productName: string
  subtitle: string
  pillowImageSrc: string
}

// "Product Card Light" in Figma
// https://www.figma.com/design/5kmmDdh6StpXzbEfr7WevV/Hedvig-UI-Kit?node-id=16269-14623&t=5zDsQbEwaXXTFOxo-0
export function ProductCardSmall({ children, productName, subtitle, pillowImageSrc }: Props) {
  return (
    <div className={card}>
      <div className={xStack({ alignItems: 'center', gap: 'sm' })}>
        <Pillow src={pillowImageSrc} size="small" />
        <div className={yStack()}>
          <Text as="span" size="lg">
            {productName}
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
