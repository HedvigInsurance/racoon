'use client'

import { useMemo } from 'react'
import { Space } from 'ui'
import { CopyToClipboard } from '@/components/DebugDialog/CopyToClipboard'
import { DebugDialog } from '@/components/DebugDialog/DebugDialog'
import { DebugShopSessionSection } from '@/components/DebugDialog/DebugShopSessionSection'
import { DebugTextKeys } from '@/components/DebugDialog/DebugTextKeys'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { usePriceIntent } from './PriceIntentContext'

export function ProductPageDebugDialog() {
  return (
    <DebugDialog>
      <Space y={0.25}>
        <DebugShopSessionSection />
        <LinkToOfferSection />
        <DebugTextKeys />
      </Space>
    </DebugDialog>
  )
}

function LinkToOfferSection() {
  const locale = useRoutingLocale()
  const { shopSession } = useShopSession()
  const [priceIntent] = usePriceIntent()

  const link = useMemo(() => {
    if (!(shopSession && priceIntent)) return null

    return PageLink.session({
      locale,
      shopSessionId: shopSession.id,
      priceIntentId: priceIntent.id,
    }).toString()
  }, [locale, shopSession, priceIntent])

  return <CopyToClipboard label="Share link to offer">{link ?? ''}</CopyToClipboard>
}
