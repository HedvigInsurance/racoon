'use client'
import { clsx } from 'clsx'
import { Badge, Heading, sprinkles, Text, yStack } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { useSelectedOffer } from '@/components/ProductPage/PurchaseForm/useSelectedOffer'
import { useFormatter } from '@/utils/useFormatter'
import { pillow, pillowWrapper, priceLabel, subTypeBadge, subTypeLabel } from './ProductHeroV2.css'

export function ProductHeroV2({ className }: { className?: string }) {
  const productData = useProductData()
  const [selectedOffer] = useSelectedOffer()
  const subType = selectedOffer?.variant.displayNameSubtype
  const formatter = useFormatter()
  return (
    <div className={clsx(yStack({ alignItems: 'center' }), className)}>
      <div className={pillowWrapper}>
        <Pillow className={pillow} size="medium" {...productData.pillowImage} priority={true} />
        {subType && (
          <Badge className={subTypeBadge} size="big">
            {subType}
          </Badge>
        )}
      </div>

      <div className={sprinkles({ textAlign: 'center' })}>
        <Heading as="h1" variant="standard.18" align="center">
          {productData.displayNameFull}
          {subType && <span className={subTypeLabel}>{` ${subType}`}</span>}
        </Heading>
        <Text color="textSecondary" size="md" className={priceLabel}>
          {selectedOffer && formatter.monthlyPrice(selectedOffer.cost.net)}
        </Text>
      </div>
    </div>
  )
}
