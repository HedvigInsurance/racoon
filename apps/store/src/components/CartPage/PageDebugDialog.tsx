'use client'

import { useMemo } from 'react'
import { Space } from 'ui'
import { CopyToClipboard } from '@/components/DebugDialog/CopyToClipboard'
import { DebugDialog } from '@/components/DebugDialog/DebugDialog'
import { DebugShopSessionSection } from '@/components/DebugDialog/DebugShopSessionSection'
import { DebugTextKeys } from '@/components/DebugDialog/DebugTextKeys'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
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
  const { routingLocale } = useCurrentLocale()
  const cartLink = useMemo(() => {
    if (!shopSession) return null

    return PageLink.session({
      locale: routingLocale,
      shopSessionId: shopSession.id,
      next: PageLink.cart({ locale: routingLocale }).pathname,
    }).toString()
  }, [shopSession, routingLocale])

  return <CopyToClipboard label="Copy link to cart">{cartLink ?? ''}</CopyToClipboard>
}

const LinkToRetargetingSection = () => {
  const { shopSession } = useShopSession()
  const { routingLocale } = useCurrentLocale()
  const retargetingLink = useMemo(() => {
    if (!shopSession) return null

    return PageLink.retargeting({
      locale: routingLocale,
      shopSessionId: shopSession.id,
    }).toString()
  }, [shopSession, routingLocale])

  return <CopyToClipboard label="Copy re-targeting link">{retargetingLink ?? ''}</CopyToClipboard>
}
