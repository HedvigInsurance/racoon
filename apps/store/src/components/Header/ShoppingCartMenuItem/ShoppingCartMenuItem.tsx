'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { ShoppingBagIcon } from './ShoppingBagIcon'
import { cartLink, wrapper } from './ShoppingCartMenuItem.css'

const DynamicCartToast = dynamic(async () => {
  const { CartToast } = await import('./CartToast')
  return CartToast
})

export function ShoppingCartMenuItem() {
  const locale = useRoutingLocale()
  const { shopSession } = useShopSession()
  // To make sure floating ui lib can proper calculate the position of the toast
  // and react if anything changes we should keep the reference anchor element as state
  const [anchorElement, setAnchorElement] = useState<HTMLAnchorElement | null>(null)

  const cartLineCount = shopSession?.cart.entries.length

  return (
    <div className={wrapper}>
      <Link
        ref={setAnchorElement}
        className={cartLink}
        href={PageLink.checkout({ locale }).pathname}
        aria-label="shopping cart"
      >
        <ShoppingBagIcon count={cartLineCount} />
      </Link>
      <DynamicCartToast anchorElement={anchorElement} />
    </div>
  )
}
