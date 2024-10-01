'use client'

import { ProductHeroV2 } from '@/features/priceCalculator/ProductHeroV2'
import { useResponsiveVariant } from '@/utils/useResponsiveVariant'
import { CartToast } from './CartToast'
import {
  pageGrid,
  priceCalculatorSection,
  productHero,
  productHeroSection,
} from './PriceCalculatorCmsPageContent.css'
import { PurchaseFormV2 } from './PurchaseFormV2'

export function PriceCalculatorCmsPageContent() {
  const variant = useResponsiveVariant('lg')

  return (
    <div className={pageGrid}>
      <section className={productHeroSection}>
        <ProductHeroV2 className={productHero} />
      </section>
      <section className={priceCalculatorSection}>
        <PurchaseFormV2 />
      </section>
      {/* We don't mount CartToast on mobile as we hide ShoppingCartMenuItem at that level */}
      {variant === 'desktop' && <CartToast />}
    </div>
  )
}
