import type { CSSProperties } from '@vanilla-extract/css'
import type { Level } from './media-query'
import { breakpoints } from './media-query'

export const animationAllowed = '(prefers-reduced-motion: no-preference)'

export const minWidth = Object.fromEntries(
  Object.entries(breakpoints).map(([name, width]) => {
    return [name, `screen and (min-width: ${width}px)`]
  }),
) as Record<Level, string>

// Media queries for use in sprinkles
export const mediaQueries = Object.fromEntries(
  Object.entries(breakpoints).map(([name, width]) => {
    return [name, { '@media': `screen and (min-width: ${width}px)` }]
  }),
)

export const hoverStyles = (styles: CSSProperties) => {
  return {
    '@media (hover: hover)': {
      '&:hover': styles,
    },
  }
}
