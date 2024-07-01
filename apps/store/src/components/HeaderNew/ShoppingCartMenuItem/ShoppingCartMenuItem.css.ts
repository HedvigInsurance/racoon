import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const wrapper = style({
  // Align to the right in the header
  marginLeft: 'auto',
  lineHeight: 0,
})

export const cartLink = style({
  display: 'inline-block',
  ':focus-visible': {
    outline: `2px solid ${tokens.colors.gray900}`,
  },
})

export const iconWrapper = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const cartCount = style({
  position: 'absolute',
  // Center vertically
  marginTop: -1,
})
