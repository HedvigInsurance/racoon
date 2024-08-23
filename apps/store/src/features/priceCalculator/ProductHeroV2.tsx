'use client'
import { clsx } from 'clsx'
import { Heading, yStack } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { pillow } from './ProductHeroV2.css'

export function ProductHeroV2({ className }: { className?: string }) {
  const productData = useProductData()
  return (
    <div className={clsx(yStack({ alignItems: 'center' }), className)}>
      <Pillow className={pillow} size="medium" {...productData.pillowImage} priority={true} />

      <Heading as="h1" variant="standard.18" align="center">
        {productData.displayNameFull}
      </Heading>
    </div>
  )
}
