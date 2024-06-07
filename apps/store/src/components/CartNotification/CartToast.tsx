import { datadogRum } from '@datadog/browser-rum'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useTranslation } from 'next-i18next'
import type { ReactNode } from 'react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Button, mq, Text, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { MENU_BAR_HEIGHT_DESKTOP } from '@/components/Header/Header.constants'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import {
  BUNDLE_DISCOUNT_PERCENTAGE,
  hasBundleDiscount,
  hasCartItemsEligibleForBundleDiscount,
} from '@/features/bundleDiscount/bundleDiscount'
import { BundleDiscountExtraProductLinks } from '@/features/bundleDiscount/BundleDiscountExtraProductLinks'
import { BundleDiscountSummary } from '@/features/bundleDiscount/BundleDiscountSummary'
import type { CartFragmentFragment } from '@/services/graphql/generated'
import { ExternalInsuranceCancellationOption } from '@/services/graphql/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { useFormatter } from '@/utils/useFormatter'
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
  if (shopSession == null || cart == null) return null

  const handleClickLink = (type: 'Primary' | 'Secondary') => () => {
    datadogRum.addAction(`CartToast Link ${type}`)
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
        <StyledOverlay />
        <StyledContentWrapper>
          <DialogPrimitive.Content onEscapeKeyDown={handleClose} onInteractOutside={handleClose}>
            <DialogContentWrapper>
              {cart.entries.map((entry) => (
                <CartToastItem key={entry.id} item={entry} />
              ))}
              {hasCartItemsEligibleForBundleDiscount(shopSession) && (
                <BundleDiscountWrapper>
                  <BundleDiscountExtraProductLinks>
                    {bundleDiscountHeader}
                  </BundleDiscountExtraProductLinks>
                </BundleDiscountWrapper>
              )}
              <SpaceFlex space={0.5} direction={'vertical'}>
                <ButtonNextLink
                  href={PageLink.cart({ locale }).pathname}
                  variant="primary"
                  onClick={handleClickLink('Primary')}
                >
                  {t('CART_TOAST_PRIMARY_LINK')}
                </ButtonNextLink>

                <Button onClick={handleClose} variant="ghost">
                  {t('DIALOG_CLOSE', { ns: 'common' })}
                </Button>
              </SpaceFlex>
            </DialogContentWrapper>
          </DialogPrimitive.Content>
        </StyledContentWrapper>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
})

CartToast.displayName = 'CartToast'

function CartToastItem({ item }: { item: CartFragmentFragment['entries'][number] }) {
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

const BundleDiscountWrapper = styled.div({
  gap: theme.space.md,
  display: 'flex',
  flexDirection: 'column',
})

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

const StyledOverlay = styled(DialogPrimitive.Overlay)({
  backgroundColor: 'rgba(0, 0, 0, 0.15)',
  position: 'fixed',
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
})

const StyledContentWrapper = styled.div({
  position: 'fixed',
  inset: 0,
})

const DialogContentWrapper = styled.div({
  position: 'absolute',
  width: '100%',

  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.lg,

  paddingTop: theme.space.lg,
  paddingInline: theme.space.md,
  paddingBottom: theme.space.xs,

  borderBottomLeftRadius: theme.radius.md,
  borderBottomRightRadius: theme.radius.md,

  backgroundColor: theme.colors.light,
  boxShadow: theme.shadow.default,

  [mq.lg]: {
    top: MENU_BAR_HEIGHT_DESKTOP,
    right: theme.space.md,
    borderRadius: theme.radius.md,
    maxWidth: '28rem',
  },
})
