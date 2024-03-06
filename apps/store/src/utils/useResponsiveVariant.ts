import { useEffect, useState } from 'react'
import { type Level } from 'ui'
import { useBreakpoint } from './useBreakpoint/useBreakpoint'

// Lazy responsive rendering, we don't want hydration errors
// and we don't want user-agent dependency for server side (mainly because it's not compatible with SSG)
export const useResponsiveVariant = (breakpoint: Level) => {
  const [variant, setVariant] = useState<'desktop' | 'mobile' | 'initial'>('initial')
  const isDesktop = useBreakpoint(breakpoint)
  useEffect(() => {
    setVariant(isDesktop ? 'desktop' : 'mobile')
  }, [isDesktop])
  return variant
}
