import { datadogLogs } from '@datadog/browser-logs'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { getUrlLocale } from '@/utils/l10n/localeUtils'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'

export const useReloadOnCountryChange = () => {
  const router = useRouter()
  const { countryCode } = useCurrentCountry()
  useEffect(() => {
    const onRoute = (url: string) => {
      const urlCountry = getCountryByLocale(getUrlLocale(url))
      if (countryCode !== urlCountry.countryCode) {
        datadogLogs.logger.warn(
          `Country changed without page reload, this is probably an error ${countryCode} -> ${urlCountry.countryCode}`,
        )
        window.location.reload()
      }
    }
    router.events.on('routeChangeStart', onRoute)
    return () => router.events.off('routeChangeStart', onRoute)
  }, [countryCode, router.events])
}
