import { useTranslation } from 'next-i18next'
import { DiscountTooltip } from '@/components/ProductPage/PurchaseForm/DiscountTooltip/DiscountTooltip'
import {
  BUNDLE_DISCOUNT_ELIGIBLE_PRODUCT_IDS,
  BUNDLE_DISCOUNT_PERCENTAGE,
} from '@/features/bundleDiscount/bundleDiscount'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

export function BundleDiscountOfferTooltip() {
  const { t } = useTranslation('purchase-form')
  const { shopSession } = useShopSession()
  if (shopSession == null) {
    return null
  }
  const numberOfEligibleCartItems = shopSession.cart.entries.filter((item) =>
    BUNDLE_DISCOUNT_ELIGIBLE_PRODUCT_IDS.has(item.product.id),
  ).length
  const key =
    numberOfEligibleCartItems === 0 ? 'BUNDLE_DISCOUNT_FIRST_OFFER' : 'BUNDLE_DISCOUNT_SECOND_OFFER'
  return <DiscountTooltip subtitle={t(key, { percentage: BUNDLE_DISCOUNT_PERCENTAGE })} />
}
