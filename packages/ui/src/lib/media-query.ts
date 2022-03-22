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
