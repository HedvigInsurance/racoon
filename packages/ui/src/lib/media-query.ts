import { useState, useLayoutEffect, useEffect } from 'react'

export type Level = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

const breakpoints: Array<[Level, number]> = [
  ['xs', 480],
  ['sm', 640],
  ['md', 768],
  ['lg', 1024],
  ['xl', 1280],
  ['xxl', 1536],
]
// FIXME: export enum with values

export const mq = breakpoints.reduce((mediaQueries, [name, value]) => {
  mediaQueries[name] = `@media (min-width: ${value}px)`
  return mediaQueries
}, {} as Record<Level, string>)

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
  }
}

/**
 * Utility function for finding out if window size is above or below a breakpoint.
 * @returns `true` if window size is at or above breakpoint, `false` otherwise
 */
export const useBreakpoint = (level: Level) => {
  // Initial value must be the same on SSR and CSR to prevent hydration errors
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 })

  useIsomorphicLayoutEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions())
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const breakpoint = breakpoints.find(([breakpointName]) => breakpointName === level)

  if (!breakpoint) throw new Error(`Unknown breakpoint ${level}`)

  const [, breakpointWidth] = breakpoint

  return windowDimensions.width >= breakpointWidth
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
