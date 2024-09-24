'use client'
import Link from 'next/link'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { ShoppingBagIcon } from './ShoppingBagIcon'
import { cartLink, wrapper } from './ShoppingCartMenuItem.css'

export const SHOP_CART_MENU_ITEM_ID = 'shopping-cart-menu-item'

export function ShoppingCartMenuItem() {
  const locale = useRoutingLocale()
  const { shopSession } = useShopSession()

  const cartLineCount = shopSession?.cart.entries.length

  return (
    <div className={wrapper}>
      <Link
        id={SHOP_CART_MENU_ITEM_ID}
        className={cartLink}
        href={PageLink.checkout({ locale }).pathname}
        aria-label="shopping cart"
      >
        <ShoppingBagIcon count={cartLineCount} />
      </Link>
    </div>
  )
}
