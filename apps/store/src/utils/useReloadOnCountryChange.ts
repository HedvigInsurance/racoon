import { datadogLogs } from '@datadog/browser-logs'
import { useEffect, useRef } from 'react'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'

export const useReloadOnCountryChange = () => {
  const { countryCode } = useCurrentCountry()
  const countryRef = useRef(countryCode)
  useEffect(() => {
    if (countryCode !== countryRef.current) {
      datadogLogs.logger.warn(
        `Country changed without page reload, this is probably an error ${countryRef.current} -> ${countryCode}`,
      )
      window.location.reload()
    }
  }, [countryCode])
}
