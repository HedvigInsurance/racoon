import { createVar, style } from '@vanilla-extract/css'
import { minWidth, tokens } from 'ui'

export const displaySubmenus = createVar()
export const displayMobileMenu = createVar()

export const headerMenu = style({
  width: '100%',
})

export const headerMenuMobile = style({
  display: displayMobileMenu,
})

export const backWrapper = style({
  backgroundColor: tokens.colors.buttonSecondary,
  borderRadius: tokens.radius.xxs,
  padding: tokens.space.xs,

  ':hover': {
    backgroundColor: tokens.colors.buttonSecondaryHover,
  },
})

export const backButtonText = style({
  display: 'none',

  '@media': {
    [minWidth.lg]: {
      display: 'block',
    },
  },
})
