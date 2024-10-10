'use client'

import { useAtomValue } from 'jotai'
import { useResponsiveVariant } from '@/utils/useResponsiveVariant'
import { priceCalculatorStepAtom } from '../../priceCalculatorAtoms'
import { ProductHeroV2 } from '../../ProductHeroV2/ProductHeroV2'
import { PurchaseFormV2 } from '../../PurchaseFormV2/PurchaseFormV2'
import { CartToast } from './CartToast/CartToast'
import {
  pageGrid,
  priceCalculatorSection,
  productHero,
  productHeroSection,
} from './PriceCalculatorCmsPageContent.css'

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
