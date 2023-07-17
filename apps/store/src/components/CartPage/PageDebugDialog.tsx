'use client'

import { useMemo } from 'react'
import { Space } from 'ui'
import { CopyToClipboard } from '@/components/DebugDialog/CopyToClipboard'
import { DebugDialog } from '@/components/DebugDialog/DebugDialog'
import { DebugShopSessionSection } from '@/components/DebugDialog/DebugShopSessionSection'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'

export const PageDebugDialog = () => {
  return (
    <DebugDialog>
      <Space y={0.25}>
        <LinkToCartSection />
        <DebugShopSessionSection />
      </Space>
    </DebugDialog>
  )
}

const LinkToCartSection = () => {
  const { shopSession } = useShopSession()
  const { routingLocale } = useCurrentLocale()
  const cartLink = useMemo(() => {
    if (!shopSession) return null

    return PageLink.session({
      locale: routingLocale,
      shopSessionId: shopSession.id,
      next: PageLink.cart({ locale: routingLocale }),
    })
  }, [shopSession, routingLocale])

  return <CopyToClipboard label="Share link to cart">{cartLink ?? ''}</CopyToClipboard>
}
