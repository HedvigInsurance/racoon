'use client'
import Link from 'next/link'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { ShoppingBagIcon } from './ShoppingBagIcon'
import { cartLink, wrapper } from './ShoppingCartMenuItem.css'

export const ShoppingCartMenuItem = () => {
  const { shopSession } = useShopSession()
  const cartLineCount = shopSession?.cart.entries.length ?? 0

  const locale = useRoutingLocale()
  return (
    <div className={wrapper}>
      <Link
        className={cartLink}
        href={PageLink.cart({ locale }).pathname}
        aria-label="shopping cart"
      >
        <ShoppingBagIcon count={cartLineCount} />
      </Link>
    </div>
  )
}
