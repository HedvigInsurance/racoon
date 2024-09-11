'use client'
import { useMemo } from 'react'
import { Heading, yStack } from 'ui'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import type { PerilFragment } from '@/services/graphql/generated'
import { useResponsiveVariant } from '@/utils/useResponsiveVariant'
import { Perils } from '../Perils'
import { PerilsTableDesktop } from './PerilsTableDesktop/PerilsTableDesktop'
import { PerilsTabs } from './PerilsTabs'

export type PerilsTableProps = {
  heading?: string
  description?: string
}

export function PerilsTable({ heading, description }: PerilsTableProps) {
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
    <>
      {variant === 'mobile' && (
        <>
          {variantsPerils.length === 1 && (
            <div className={yStack({ gap: 'lg' })}>
              {heading && (
                <Heading as="p" color="textPrimary" variant="standard.24" balance={true}>
                  {heading}
                </Heading>
              )}
              {description && (
                <Heading as="p" color="textSecondary" variant="standard.24" balance={true}>
                  {description}
                </Heading>
              )}
              <Perils items={variantsPerils[0].perils} />
            </div>
          )}

          {variantsPerils.length > 1 && (
            <PerilsTabs
              heading={heading}
              description={description}
              variantsPerils={variantsPerils}
            />
          )}
        </>
      )}

      {variant === 'desktop' && (
        <PerilsTableDesktop
          heading={heading}
          variantsPerils={variantsPerils}
          allPerils={allPerils}
        />
      )}
    </>
  )
}

export type VariantPerils = {
  typeOfContract: string
  displayNameSubtype: string
  perils: Array<PerilFragment>
  missingPerils: Array<PerilFragment>
}
