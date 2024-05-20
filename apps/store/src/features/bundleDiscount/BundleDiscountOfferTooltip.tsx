import { useTranslation } from 'next-i18next'
import { DiscountTooltip } from '@/components/ProductPage/PurchaseForm/DiscountTooltip/DiscountTooltip'
import { useCartEntryToReplace } from '@/components/ProductPage/useCartEntryToReplace'
import {
  BUNDLE_DISCOUNT_ELIGIBLE_PRODUCT_IDS,
  BUNDLE_DISCOUNT_PERCENTAGE,
} from '@/features/bundleDiscount/bundleDiscount'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

export function BundleDiscountOfferTooltip() {
  const { t } = useTranslation('purchase-form')
  const { shopSession } = useShopSession()
  const isEditingCartItem = useCartEntryToReplace() != null
  if (shopSession == null) {
    return null
  }
  let numberOfEligibleCartItems = shopSession.cart.entries.filter((item) =>
    BUNDLE_DISCOUNT_ELIGIBLE_PRODUCT_IDS.has(item.product.id),
  ).length
  if (isEditingCartItem) {
    numberOfEligibleCartItems -= 1
  }
  const key =
    numberOfEligibleCartItems < 1 ? 'BUNDLE_DISCOUNT_FIRST_OFFER' : 'BUNDLE_DISCOUNT_SECOND_OFFER'
  return <DiscountTooltip subtitle={t(key, { percentage: BUNDLE_DISCOUNT_PERCENTAGE })} />
}
