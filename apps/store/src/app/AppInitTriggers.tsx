'use client'
import { useInitDatadogAfterInteractive } from '@/services/logger/client'
import { useAllowActiveStylesInSafari } from '@/utils/useAllowActiveStylesInSafari'

// Separate component since we want to make it client-side and avoid re-rendering whole app if any internal state changes
export function AppInitTriggers() {
  useInitDatadogAfterInteractive()
  useAllowActiveStylesInSafari()
  // TODO: GTM, track pageviews, track experiment impressions
  return null
}
