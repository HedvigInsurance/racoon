import { useMemo } from 'react'
import { yStack } from 'ui'
import { CopyToClipboard } from '@/components/DebugDialog/CopyToClipboard'
import { DebugDialog } from '@/components/DebugDialog/DebugDialog'
import { DebugShopSessionSection } from '@/components/DebugDialog/DebugShopSessionSection'
import { DebugTextKeys } from '@/components/DebugDialog/DebugTextKeys'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { usePriceIntent } from './PriceIntentContext'

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
  const [priceIntent] = usePriceIntent()

  const link = useMemo(() => {
    if (!(shopSessionId && priceIntent)) return null

    return PageLink.session({
      locale,
      shopSessionId,
      priceIntentId: priceIntent.id,
    }).toString()
  }, [locale, shopSessionId, priceIntent])

  return <CopyToClipboard label="Share link to offer">{link ?? ''}</CopyToClipboard>
}
