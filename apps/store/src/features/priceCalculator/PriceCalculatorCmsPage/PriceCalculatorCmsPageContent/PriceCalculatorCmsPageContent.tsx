'use client'

import { useAtomValue } from 'jotai'
import { priceCalculatorShowPurchaseSummaryAtom } from '@/features/priceCalculator/priceCalculatorAtoms'
import { PurchaseSummary } from '@/features/priceCalculator/PurchaseFormV2/PurchaseSummary/PurchaseSummary'
import { useResponsiveVariant } from '@/utils/useResponsiveVariant'
import { ProductHeroV2 } from '../../ProductHeroV2/ProductHeroV2'
import { PurchaseFormV2 } from '../../PurchaseFormV2/PurchaseFormV2'
import { CartToast } from './CartToast/CartToast'
import {
  pageGrid,
  priceCalculatorSection,
  productHero,
  productHeroSection,
  purchaseSummaryWrapper,
  purchaseSummary,
} from './PriceCalculatorCmsPageContent.css'

export function PriceCalculatorCmsPageContent() {
  const variant = useResponsiveVariant('lg')
  const showPurchaseSummary = useAtomValue(priceCalculatorShowPurchaseSummaryAtom)

  const showProductHero = variant === 'desktop' || !showPurchaseSummary

  return (
    <div className={pageGrid}>
      {showProductHero && (
        <section className={productHeroSection}>
          <ProductHeroV2 className={productHero} />
        </section>
      )}
      <section className={priceCalculatorSection}>
        {showPurchaseSummary ? (
          <div className={purchaseSummaryWrapper}>
            <PurchaseSummary className={purchaseSummary} />
          </div>
        ) : (
          <PurchaseFormV2 />
        )}
      </section>
      {/* We don't mount CartToast on mobile as we hide ShoppingCartMenuItem at that level */}
      {variant === 'desktop' && <CartToast />}
    </div>
  )
}
