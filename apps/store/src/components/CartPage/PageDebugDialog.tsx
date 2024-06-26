'use client'

import { useMemo } from 'react'
import { Space } from 'ui'
import { CopyToClipboard } from '@/components/DebugDialog/CopyToClipboard'
import { DebugDialog } from '@/components/DebugDialog/DebugDialog'
import { DebugShopSessionSection } from '@/components/DebugDialog/DebugShopSessionSection'
import { DebugTextKeys } from '@/components/DebugDialog/DebugTextKeys'
import { useShopSession, useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'

export const PageDebugDialog = () => {
  return (
    <DebugDialog>
      <Space y={0.25}>
        <LinkToCartSection />
        <LinkToRetargetingSection />
        <DebugShopSessionSection />
        <DebugTextKeys />
      </Space>
    </DebugDialog>
  )
}

const LinkToCartSection = () => {
  const { shopSession } = useShopSession()
  const locale = useRoutingLocale()
  const cartLink = useMemo(() => {
    if (!shopSession) return null

    return PageLink.session({
      locale,
      shopSessionId: shopSession.id,
      next: PageLink.cart({ locale }).pathname,
    }).toString()
  }, [shopSession, locale])

  return <CopyToClipboard label="Copy link to cart">{cartLink ?? ''}</CopyToClipboard>
}

const LinkToRetargetingSection = () => {
  const shopSessionId = useShopSessionId()
  const locale = useRoutingLocale()
  const retargetingLink = useMemo(() => {
    if (shopSessionId == null) return null

    return PageLink.retargeting({
      locale,
      shopSessionId,
    }).toString()
  }, [shopSessionId, locale])

  return <CopyToClipboard label="Copy re-targeting link">{retargetingLink ?? ''}</CopyToClipboard>
}
