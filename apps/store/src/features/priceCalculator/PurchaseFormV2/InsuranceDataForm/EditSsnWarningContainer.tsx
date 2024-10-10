import { datadogRum } from '@datadog/browser-rum'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { ChangeSsnWarningDialog } from '@/components/ChangeSsnWarningDialog/ChangeSsnWarningDialog'
import { priceCalculatorShowEditSsnWarningAtom } from '@/features/priceCalculator/priceCalculatorAtoms'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'

export function EditSsnWarningContainer() {
  const [isVisible, setVisible] = useAtom(priceCalculatorShowEditSsnWarningAtom)

  const shopSessionId = useShopSessionId()

  const handleAccept = useCallback(() => {
    datadogRum.addAction('Cleared shopSession to change SSN in price calculator', {
      shopSessionId,
    })
    // NOTE: We used to have soft reload here, but since lots of code in PriceCalculator
    // assumes shopSessionId does not change mid-way, it's easier to just hard reload
    // It's not very common operation, we had ~50 / day for one random week
    //
    // If you consider doing soft reload:
    // - reset priceIntentId from state in `useSyncPriceIntentState` based on changing shopSessionId after initial render
    // - figure out how to handle preloadedPriceIntentId
    // - figure out how to handle edit cart item mode -> there's no cart item to edit since it's a new session
    window.location.reload()
  }, [shopSessionId])

  const handleDecline = () => setVisible(false)
  return (
    <ChangeSsnWarningDialog open={isVisible} onDecline={handleDecline} onAccept={handleAccept} />
  )
}
