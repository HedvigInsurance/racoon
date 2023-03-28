import { useState, useLayoutEffect, useEffect } from 'react'

export type Level = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export const breakpoints: Record<Level, number> = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
}

export const mq = Object.fromEntries(
  Object.entries(breakpoints).map(([name, width]) => {
    return [name, `@media (min-width: ${width}px)`]
  }),
)

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
  }
}

let timeout: number | undefined = undefined

/**
 * Utility function for finding out if window size is above or below a breakpoint.
 * @returns `true` if window size is at or above breakpoint, `false` otherwise
 */
export const useBreakpoint = (level: Level) => {
  // Initial value must be the same on SSR and CSR to prevent hydration errors
  const [isLarger, setIsLarger] = useState(false)

  useIsomorphicLayoutEffect(() => {
    const handleResize = () => {
      if (timeout) {
        window.cancelAnimationFrame(timeout)
      }

      // We wrap it in requestAnimationFrame to avoid this error - ResizeObserver loop limit exceeded
      timeout = window.requestAnimationFrame(() => {
        const breakpointWidth = breakpoints[level]
        if (!breakpointWidth) throw new Error(`Unknown breakpoint ${level}`)
        setIsLarger(getWindowDimensions().width >= breakpointWidth)
      })
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (timeout) window.cancelAnimationFrame(timeout)
    }
  }, [])

  return isLarger
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
