import { style, styleVariants } from '@vanilla-extract/css'
import { hoverStyles, tokens } from 'ui/src/theme'

export const bundleProductLink = styleVariants({
  primary: {
    position: 'relative',
    ...hoverStyles({
      backgroundColor: tokens.colors.gray50,
    }),
  },

  secondary: {
    position: 'relative',
    ...hoverStyles({
      backgroundColor: tokens.colors.gray200,
    }),
  },

  ghost: {
    position: 'relative',
    ...hoverStyles({
      backgroundColor: 'transparent',
    }),
  },
})

export const bundleProductlinkAside = style({
  top: '50% !important',
  transform: 'translateY(-50%)',
})
