'use client'
import { useParams, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useReportDeviceInfo } from '@/services/Tracking/useReportDeviceInfo'
import { useTracking } from '@/services/Tracking/useTracking'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { FALLBACK_LOCALE } from '@/utils/l10n/locales'
import { toRoutingLocale } from '@/utils/l10n/localeUtils'
import type { RoutingLocale } from '@/utils/l10n/types'

export function AppTrackingTriggers() {
  const tracking = useTracking()
  useReportDeviceInfo()

  const { locale = toRoutingLocale(FALLBACK_LOCALE) } = useParams() ?? {}
  useEffect(() => {
    if (locale) {
      tracking.reportAppInit(getCountryByLocale(locale as RoutingLocale).countryCode)
    }
  }, [locale, tracking])

  const pathname = usePathname()
  useEffect(() => {
    if (pathname) {
      tracking.reportPageView(pathname)
    }
  }, [pathname, tracking])

  return null
}
