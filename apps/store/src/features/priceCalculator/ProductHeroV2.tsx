'use client'
import { clsx } from 'clsx'
import { Heading, sprinkles, Text, yStack } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { useSelectedOffer } from '@/components/ProductPage/PurchaseForm/useSelectedOffer'
import { useFormatter } from '@/utils/useFormatter'
import { pillow, priceLabel } from './ProductHeroV2.css'

export function ProductHeroV2({ className }: { className?: string }) {
  const productData = useProductData()
  const [selectedOffer] = useSelectedOffer()
  const formatter = useFormatter()
  return (
    <div className={clsx(yStack({ alignItems: 'center' }), className)}>
      <Pillow className={pillow} size="medium" {...productData.pillowImage} priority={true} />

      <div className={sprinkles({ textAlign: 'center' })}>
        <Heading as="h1" variant="standard.18" align="center">
          {productData.displayNameFull}
        </Heading>
        <Text color="textSecondary" size="md" className={priceLabel}>
          {selectedOffer && formatter.monthlyPrice(selectedOffer.cost.net)}
        </Text>
      </div>
    </div>
  )
}
