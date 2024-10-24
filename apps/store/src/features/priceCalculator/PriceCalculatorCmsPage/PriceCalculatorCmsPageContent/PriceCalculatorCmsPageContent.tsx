'use client'

import { useAtomValue } from 'jotai'
import { useSyncPriceIntentState } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { priceCalculatorAddedOffer } from '@/features/priceCalculator/priceCalculatorAtoms'
import { PurchaseSummary } from '@/features/priceCalculator/PurchaseFormV2/PurchaseSummary/PurchaseSummary'
import { useResponsiveVariant } from '@/utils/useResponsiveVariant'
import { ProductHeroV2 } from '../../ProductHeroV2/ProductHeroV2'
import { PurchaseFormV2 } from '../../PurchaseFormV2/PurchaseFormV2'
import { CartToast } from './CartToast/CartToast'
import {
  pageGrid,
  priceCalculatorSection,
  productHeroSection,
  purchaseSummaryWrapper,
  purchaseSummary,
} from './PriceCalculatorCmsPageContent.css'

export function PriceCalculatorCmsPageContent() {
  const variant = useResponsiveVariant('lg')
  const addedOfferToCart = useAtomValue(priceCalculatorAddedOffer)

  useSyncPriceIntentState({ replacePriceIntentWhenCurrentIsAddedToCart: true })

  const showProductHero = variant === 'desktop' || !addedOfferToCart

  return (
    <div className={pageGrid}>
      {showProductHero && (
        <section className={productHeroSection}>
          <ProductHeroV2 />
        </section>
      )}
      <section className={priceCalculatorSection}>
        {addedOfferToCart ? (
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
