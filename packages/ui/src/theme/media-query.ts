export type Level = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

const breakpoints: Record<Level, number> = {
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

export const getMediaQueryBreakpoint = (level: Level) => {
  const breakpointWidth = breakpoints[level]
  if (!breakpointWidth) throw new Error(`Unknown breakpoint ${level}`)
  return breakpointWidth
}
