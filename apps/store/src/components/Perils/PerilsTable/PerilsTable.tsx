'use client'
import { useMemo } from 'react'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import type { PerilFragment } from '@/services/graphql/generated'
import { useResponsiveVariant } from '@/utils/useResponsiveVariant'
import { PerilsTableDesktop } from './PerilsTableDesktop'
import { PerilsTabs } from './PerilsTabs'

export function PerilsTable() {
  const variant = useResponsiveVariant('lg')
  const { variants: productVariants } = useProductData()

  const allPerils = useMemo(() => {
    const perilsMap = new Map(
      productVariants.flatMap((productVariant) =>
        productVariant.perils.map((peril) => [peril.title, peril]),
      ),
    )
    return Array.from(perilsMap.values())
  }, [productVariants])

  const variantsPerils: Array<VariantPerils> = useMemo(() => {
    return productVariants.map((variant) => {
      return {
        typeOfContract: variant.typeOfContract,
        displayNameSubtype: variant.displayNameSubtype,
        perils: variant.perils,
        missingPerils: allPerils.filter(
          (peril) => !variant.perils.some((variantPeril) => variantPeril.title === peril.title),
        ),
      }
    })
  }, [productVariants, allPerils])

  return (
    <div>
      {variant === 'mobile' && <PerilsTabs variantsPerils={variantsPerils} />}
      {variant === 'desktop' && (
        <PerilsTableDesktop variantsPerils={variantsPerils} allPerils={allPerils} />
      )}
    </div>
  )
}

export type VariantPerils = {
  typeOfContract: string
  displayNameSubtype: string
  perils: Array<PerilFragment>
  missingPerils: Array<PerilFragment>
}
