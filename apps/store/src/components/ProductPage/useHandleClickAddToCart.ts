import { useState } from 'react'
import { useRefreshData } from '@/hooks/useRefreshData'
import { useCurrentMarket } from '@/lib/l10n/useCurrentMarket'
import { PageLink } from '@/lib/PageLink'

type Params = {
  lineId: string | null
  onSuccess: () => void
}

export const useHandleClickAddToCart = ({ lineId, onSuccess }: Params) => {
  const { countryCode } = useCurrentMarket()
  const refreshData = useRefreshData()
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle')

  const handleClick = async () => {
    if (status === 'submitting') return
    if (lineId === null) throw new Error('Trying to submit without lineId')

    setStatus('submitting')

    try {
      await fetch(PageLink.apiCartLinesAdd({ lineId }), {
        method: 'PATCH',
        body: JSON.stringify({ countryCode }),
        headers: { 'Content-Type': 'application/json' },
      })
      onSuccess()
      await refreshData()
    } finally {
      setStatus('idle')
    }
  }

  return [handleClick, status] as const
}
