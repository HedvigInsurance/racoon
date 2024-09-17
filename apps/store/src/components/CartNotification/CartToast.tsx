import { datadogRum } from '@datadog/browser-rum'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useTranslation } from 'next-i18next'
import type { ReactNode } from 'react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Button, Text, yStack } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import {
  BUNDLE_DISCOUNT_PERCENTAGE,
  hasBundleDiscount,
  hasCartItemsEligibleForBundleDiscount,
} from '@/features/bundleDiscount/bundleDiscount'
import { BundleDiscountExtraProductLinks } from '@/features/bundleDiscount/BundleDiscountExtraProductLinks'
import { BundleDiscountSummary } from '@/features/bundleDiscount/BundleDiscountSummary'
import type { CartFragment } from '@/services/graphql/generated'
import { ExternalInsuranceCancellationOption } from '@/services/graphql/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { useFormatter } from '@/utils/useFormatter'
import { contentWrapper, dialogContentWrapper, styledOverlay } from './CartToast.css'
import { ProductItem } from './ProductItem'

export type CartToastAttributes = {
  show: () => void
}

export const CartToast = forwardRef<CartToastAttributes>((_, forwardedRef) => {
  const [isOpen, setOpen] = useState(false)
  const handleClose = () => setOpen(false)

  useImperativeHandle(forwardedRef, () => ({
    show() {
      setOpen(true)
    },
  }))

  const { t } = useTranslation(['purchase-form', 'cart'])
  const locale = useRoutingLocale()
  const { shopSession } = useShopSession()
  const { cart } = shopSession ?? {}
  const tracking = useTracking()

  if (shopSession == null || cart == null) return null

  const handleClickLink = (type: 'Primary' | 'Secondary') => () => {
    datadogRum.addAction(`CartToast Link ${type}`)
    tracking.reportBeginCheckout(cart)
  }

  let bundleDiscountHeader: ReactNode
  if (hasBundleDiscount(shopSession)) {
    bundleDiscountHeader = (
      <BundleDiscountSummary>
        {t('BUNDLE_DISCOUNT_CART_TOAST_SUMMARY', {
          percentage: BUNDLE_DISCOUNT_PERCENTAGE,
        })}
      </BundleDiscountSummary>
    )
  } else {
    // This is awkward, but we're duplicating default header just to have different subtitle
    bundleDiscountHeader = (
      <div>
        <Text>{t('BUNDLE_DISCOUNT_QUICK_LINKS_TITLE', { ns: 'cart' })}</Text>
        <Text color="textSecondary">
          {t('BUNDLE_DISCOUNT_CART_TOAST_QUICK_LINKS_SUBTITLE', {
            percentage: BUNDLE_DISCOUNT_PERCENTAGE,
          })}
        </Text>
      </div>
    )
  }

  return (
    <DialogPrimitive.Root open={isOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styledOverlay} />
        <div className={contentWrapper}>
          <DialogPrimitive.Content onEscapeKeyDown={handleClose} onInteractOutside={handleClose}>
            <div className={dialogContentWrapper}>
              {cart.entries.map((entry) => (
                <CartToastItem key={entry.id} item={entry} />
              ))}
              {hasCartItemsEligibleForBundleDiscount(shopSession) && (
                <div className={yStack({ gap: 'md' })}>
                  <BundleDiscountExtraProductLinks>
                    {bundleDiscountHeader}
                  </BundleDiscountExtraProductLinks>
                </div>
              )}
              <div className={yStack({ gap: 'xs' })}>
                <ButtonNextLink
                  href={PageLink.checkout({ locale }).pathname}
                  variant="primary"
                  onClick={handleClickLink('Primary')}
                  fullWidth={true}
                >
                  {t('CART_TOAST_PRIMARY_LINK')}
                </ButtonNextLink>

                <Button onClick={handleClose} variant="ghost" fullWidth={true}>
                  {t('DIALOG_CLOSE', { ns: 'common' })}
                </Button>
              </div>
            </div>
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
})

CartToast.displayName = 'CartToast'

function CartToastItem({ item }: { item: CartFragment['entries'][number] }) {
  const { t } = useTranslation(['purchase-form', 'cart'])
  const formatter = useFormatter()
  const description =
    !item.cancellation.requested ||
    item.cancellation.option === ExternalInsuranceCancellationOption.BanksigneringInvalidRenewalDate
      ? t('CART_ENTRY_DATE_LABEL', {
          date: formatter.fromNow(new Date(item.startDate)),
          ns: 'cart',
        })
      : t('CART_ENTRY_AUTO_SWITCH', { ns: 'cart' })
  return (
    <ProductItem
      name={item.product.displayNameFull}
      pillowSrc={item.product.pillowImage.src}
      price={formatter.monthlyPrice(item.cost.net)}
      description={description}
    />
  )
}
