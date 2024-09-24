import { createVar, style } from '@vanilla-extract/css'
import { minWidth, responsiveStyles, tokens, xStack } from 'ui'

export const displaySubmenus = createVar()
export const displayMobileMenu = createVar()

export const headerMenu = style([
  xStack({ alignItems: 'center' }),
  {
    width: '100%',
  },
])

export const headerMenuMobile = style({
  display: displayMobileMenu,
  lineHeight: 0,
})

export const backLink = style([
  xStack({ gap: 'md', alignItems: 'center' }),
  {
    marginLeft: 'auto',

    ...responsiveStyles({
      lg: {
        marginLeft: 'unset',
      },
    }),
  },
])

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
