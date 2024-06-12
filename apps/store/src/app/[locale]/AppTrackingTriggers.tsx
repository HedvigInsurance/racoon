'use client'
import { useParams, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useTracking } from '@/services/Tracking/useTracking'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import type { RoutingLocale } from '@/utils/l10n/types'

export function AppTrackingTriggers() {
  const tracking = useTracking()

  const locale = getLocaleOrFallback(useParams()?.locale as RoutingLocale | undefined).routingLocale
  useEffect(() => {
    tracking.reportAppInit(getCountryByLocale(locale).countryCode)
  }, [locale, tracking])

  const pathname = usePathname()
  useEffect(() => {
    if (pathname) {
      tracking.reportPageView(pathname)
    }
  }, [pathname, tracking])

  return null
}
