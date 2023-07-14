'use client'

import { useMemo } from 'react'
import { Space, Text } from 'ui'
import { CopyToClipboard } from '@/components/DebugDialog/CopyToClipboard'
import { DebugDialog } from '@/components/DebugDialog/DebugDialog'
import { DebugShopSessionSection } from '@/components/DebugDialog/DebugShopSessionSection'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { usePriceIntent } from './PriceIntentContext'

export const PageDebugDialog = () => {
  return (
    <DebugDialog>
      <Space y={1}>
        <DebugShopSessionSection />
        <LinkToOfferSection />
      </Space>
    </DebugDialog>
  )
}

const LinkToOfferSection = () => {
  const { routingLocale } = useCurrentLocale()
  const { shopSession } = useShopSession()
  const [priceIntent] = usePriceIntent()

  const link = useMemo(() => {
    if (!(shopSession && priceIntent)) return null

    return PageLink.session({
      locale: routingLocale,
      shopSessionId: shopSession.id,
      priceIntentId: priceIntent.id,
    })
  }, [routingLocale, shopSession, priceIntent])

  return (
    <Space y={0.25}>
      <Text as="p" size="sm">
        Share link to offer
      </Text>
      <CopyToClipboard>{link ?? ''}</CopyToClipboard>
    </Space>
  )
}
