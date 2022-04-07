import { useState, useEffect } from "react"

export type Level = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

const breakpoints: Array<[Level, number]> = [
  ['xs', 480],
  ['sm', 640],
  ['md', 768],
  ['lg', 1024],
  ['xl', 1280],
  ['xxl', 1536],
]

export const mq = breakpoints.reduce((mediaQueries, [name, value]) => {
  mediaQueries[name] = `@media (min-width: ${value}px)`
  return mediaQueries
}, {} as Record<Level, string>)


function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export const useBreakpoint = (level: Level) => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const breakpoint = breakpoints.find(([breakpointName]) => breakpointName === level)

  if (!breakpoint) return false

  const [, breakpointWidth] = breakpoint

  return windowDimensions.width >= breakpointWidth
}
