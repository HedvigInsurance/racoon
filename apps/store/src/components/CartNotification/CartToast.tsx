import styled from '@emotion/styled'
import Link from 'next/link'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Button, LinkButton, Space } from 'ui'
import { PageLink } from '@/lib/PageLink'
import * as CartNotification from './CartNotification'
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
    <CartNotification.Root open={isOpen}>
      {product && <CartNotificationContent onClose={handleClose} {...product} />}
    </CartNotification.Root>
  )
})

CartToast.displayName = 'CartToast'

type Props = ProductItemProps & {
  onClose: () => void
}

const CartNotificationContent = ({ name, price, gradient, onClose }: Props) => {
  return (
    <CartNotification.Content
      onClose={onClose}
      Title={<CartNotification.Header>Insurance added to cart</CartNotification.Header>}
    >
      <DialogContentWrapper y={1.5}>
        <ProductItem name={name} price={price} gradient={gradient} />

        <Space y={0.5}>
          <Link href={PageLink.cart()} passHref>
            <LinkButton fullWidth>Proceed to cart</LinkButton>
          </Link>

          <Button onClick={onClose} variant="outlined" fullWidth>
            Continue shopping
          </Button>
        </Space>
      </DialogContentWrapper>
    </CartNotification.Content>
  )
}

const DialogContentWrapper = styled(Space)(({ theme }) => ({
  paddingLeft: theme.space[3],
  paddingRight: theme.space[3],
  paddingBottom: theme.space[3],
  backgroundColor: theme.colors.white,
}))
