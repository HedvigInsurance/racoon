import { useEffect, useLayoutEffect, useState } from 'react'
import { Level, getMediaQueryBreakpoint } from 'ui'

/**
 * Utility function for finding out if window size is above or below a breakpoint.
 * @returns `true` if window size is at or above breakpoint, `false` otherwise
 */
export const useBreakpoint = (level: Level) => {
  // Initial value must be the same on SSR and CSR to prevent hydration errors
  const [isLarger, setIsLarger] = useState(false)

  useIsomorphicLayoutEffect(() => {
    const handleResize = () => {
      const breakpointWidth = getMediaQueryBreakpoint(level)
      setIsLarger(getWindowDimensions().width >= breakpointWidth)
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isLarger
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
  }
}
