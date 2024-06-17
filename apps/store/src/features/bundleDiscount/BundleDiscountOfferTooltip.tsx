import { useInView } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { useEffect, useRef } from 'react'
import {
  useProductData,
  useSelectedProductVariant,
} from '@/components/ProductData/ProductDataProvider'
import { DiscountTooltip } from '@/components/ProductPage/PurchaseForm/DiscountTooltip/DiscountTooltip'
import { useCartEntryToReplace } from '@/components/ProductPage/useCartEntryToReplace'
import {
  BUNDLE_DISCOUNT_ELIGIBLE_PRODUCT_IDS,
  BUNDLE_DISCOUNT_PERCENTAGE,
} from '@/features/bundleDiscount/bundleDiscount'
import { type ProductOfferFragment } from '@/services/graphql/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'

type Props = {
  offer: ProductOfferFragment
}

export function BundleDiscountOfferTooltip({ offer }: Props) {
  const { t } = useTranslation('purchase-form')
  const { shopSession } = useShopSession()
  const tracking = useTracking()
  const productData = useProductData()
  const selectedProductVariant = useSelectedProductVariant()
  const elementRef = useRef(null)
  const justBecameVisible = useInView(elementRef, { once: true })
  const isEditingCartItem = useCartEntryToReplace() != null

  let numberOfEligibleCartItems =
    shopSession?.cart.entries.filter((item) =>
      BUNDLE_DISCOUNT_ELIGIBLE_PRODUCT_IDS.has(item.product.id),
    ).length ?? 0
  if (isEditingCartItem) {
    numberOfEligibleCartItems -= 1
  }
  const promotionKey =
    numberOfEligibleCartItems < 1 ? 'BUNDLE_DISCOUNT_FIRST_OFFER' : 'BUNDLE_DISCOUNT_SECOND_OFFER'

  const priceAmount = offer.cost.net.amount
  useEffect(() => {
    if (justBecameVisible) {
      tracking.reportViewPromotion({
        promotionId: 'bundle_discount',
        creativeName: promotionKey,
        productId: productData.id,
        productName: productData.displayNameFull,
        productVariant: selectedProductVariant?.typeOfContract,
        priceAmount,
      })
    }
  }, [
    justBecameVisible,
    offer,
    priceAmount,
    productData.displayNameFull,
    productData.id,
    promotionKey,
    selectedProductVariant?.typeOfContract,
    tracking,
  ])
  return (
    <DiscountTooltip
      ref={elementRef}
      subtitle={t(promotionKey, { percentage: BUNDLE_DISCOUNT_PERCENTAGE })}
    />
  )
}
