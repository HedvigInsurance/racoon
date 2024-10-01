import { style } from '@vanilla-extract/css'
import { hoverStyles, tokens } from 'ui/src/theme'

export const bundleProductLink = style({
  position: 'relative',

  ...hoverStyles({
    backgroundColor: tokens.colors.gray200,
  }),
})

export const bundleProductlinkAside = style({
  top: '50% !important',
  transform: 'translateY(-50%)',
})
