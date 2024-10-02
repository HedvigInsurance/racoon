'use client'

import { useAtomValue } from 'jotai'
import { ProductHeroV2 } from '@/features/priceCalculator/ProductHeroV2'
import { useResponsiveVariant } from '@/utils/useResponsiveVariant'
import { CartToast } from './CartToast'
import { priceCalculatorStepAtom } from './priceCalculatorAtoms'
import {
  pageGrid,
  priceCalculatorSection,
  productHero,
  productHeroSection,
} from './PriceCalculatorCmsPageContent.css'
import { PurchaseFormV2 } from './PurchaseFormV2'

export function PriceCalculatorCmsPageContent() {
  const variant = useResponsiveVariant('lg')
  const step = useAtomValue(priceCalculatorStepAtom)

  const showProductHero = variant === 'desktop' || step !== 'purchaseSummary'

  return (
    <div className={pageGrid}>
      {showProductHero && (
        <section className={productHeroSection}>
          <ProductHeroV2 className={productHero} />
        </section>
      )}
      <section className={priceCalculatorSection}>
        <PurchaseFormV2 />
      </section>
      {/* We don't mount CartToast on mobile as we hide ShoppingCartMenuItem at that level */}
      {variant === 'desktop' && <CartToast />}
    </div>
  )
}
