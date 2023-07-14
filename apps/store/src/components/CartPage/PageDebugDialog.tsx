'use client'

import { useMemo } from 'react'
import { Space, Text } from 'ui'
import { CopyToClipboard } from '@/components/DebugDialog/CopyToClipboard'
import { DebugDialog } from '@/components/DebugDialog/DebugDialog'
import { DebugShopSessionSection } from '@/components/DebugDialog/DebugShopSessionSection'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'

export const PageDebugDialog = () => {
  return (
    <DebugDialog>
      <Space y={1}>
        <DebugShopSessionSection />
        <LinkToCartSection />
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

  return (
    <Space y={0.25}>
      <Text as="p" size="sm">
        Share link to cart
      </Text>
      <CopyToClipboard>{cartLink ?? ''}</CopyToClipboard>
    </Space>
  )
}
