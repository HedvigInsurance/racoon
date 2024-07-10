'use client'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { yStack } from 'ui'
import { CopyToClipboard } from '@/components/DebugDialog/CopyToClipboard'
import { DebugDialog } from '@/components/DebugDialog/DebugDialog'
import { DebugShopSessionSection } from '@/components/DebugDialog/DebugShopSessionSection'
import { DebugTextKeys } from '@/components/DebugDialog/DebugTextKeys'
import { currentPriceIntentIdAtom } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'

export function ProductPageDebugDialog() {
  return (
    <DebugDialog>
      <div className={yStack({ gap: 'xs' })}>
        <DebugShopSessionSection />
        <LinkToOfferSection />
        <DebugTextKeys />
      </div>
    </DebugDialog>
  )
}

function LinkToOfferSection() {
  const locale = useRoutingLocale()
  const shopSessionId = useShopSessionId()
  const priceIntentId = useAtomValue(currentPriceIntentIdAtom)

  const link = useMemo(() => {
    if (shopSessionId == null || priceIntentId == null) {
      return null
    }

    return PageLink.session({
      locale,
      shopSessionId,
      priceIntentId,
    }).toString()
  }, [locale, shopSessionId, priceIntentId])

  return <CopyToClipboard label="Share link to offer">{link ?? ''}</CopyToClipboard>
}
