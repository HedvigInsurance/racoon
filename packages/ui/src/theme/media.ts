import { breakpoints, Level } from './media-query'

export const animationAllowed = '(prefers-reduced-motion: no-preference)'

export const minWidth = Object.fromEntries(
  Object.entries(breakpoints).map(([name, width]) => {
    return [name, `screen and (min-width: ${width}px)`]
  }),
) as Record<Level, string>
