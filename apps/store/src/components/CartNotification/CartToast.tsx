import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useTranslation } from 'next-i18next'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Space, mq, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { MENU_BAR_HEIGHT_DESKTOP } from '../Header/HeaderStyles'
import { ProductItem, ProductItemProps } from './ProductItem'

export type CartToastAttributes = {
  publish: (product: ProductItemProps) => void
}

export const CartToast = forwardRef<CartToastAttributes>((_, forwardedRef) => {
  const [product, setProduct] = useState<ProductItemProps | null>(null)

  const isOpen = product !== null
  const handleClose = () => setProduct(null)

  useImperativeHandle(forwardedRef, () => ({
    publish: (product: ProductItemProps) => setProduct(product),
  }))

  return (
    <DialogPrimitive.Root open={isOpen}>
      {product && <CartNotificationContent onClose={handleClose} {...product} />}
    </DialogPrimitive.Root>
  )
})

CartToast.displayName = 'CartToast'

type Props = ProductItemProps & {
  onClose: () => void
}

export const CartNotificationContent = ({ onClose, ...productItemProps }: Props) => {
  const { routingLocale } = useCurrentLocale()
  const { t } = useTranslation('purchase-form')
  const handleClose = () => onClose?.()

  return (
    <DialogPrimitive.Portal>
      <StyledOverlay />
      <StyledContentWrapper>
        <DialogContent onEscapeKeyDown={handleClose} onInteractOutside={handleClose}>
          <DialogContentWrapper>
            <ProductItem {...productItemProps} />
            <Space y={0.5}>
              <ButtonNextLink href={PageLink.cart()} variant="primary">
                {t('CART_TOAST_CART_LINK')}
              </ButtonNextLink>

              <ButtonNextLink
                href={PageLink.store({ locale: routingLocale })}
                onClick={onClose}
                variant="ghost"
              >
                {t('CART_TOAST_STORE_LINK')}
              </ButtonNextLink>
            </Space>
          </DialogContentWrapper>
        </DialogContent>
      </StyledContentWrapper>
    </DialogPrimitive.Portal>
  )
}

const DialogContent = styled(DialogPrimitive.Content)({
  [mq.lg]: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
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
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.lg,

  paddingInline: theme.space.md,
  paddingTop: theme.space.lg,
  paddingBottom: theme.space.xs,

  borderBottomLeftRadius: theme.radius.md,
  borderBottomRightRadius: theme.radius.md,

  backgroundColor: theme.colors.light,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',

  [mq.lg]: {
    top: MENU_BAR_HEIGHT_DESKTOP,
    right: theme.space.md,
    borderRadius: theme.radius.md,
    maxWidth: '28rem',
  },
})
