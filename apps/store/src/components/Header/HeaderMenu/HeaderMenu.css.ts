import { createVar, style } from '@vanilla-extract/css'
import { minWidth, responsiveStyles, sprinkles, tokens, xStack } from 'ui'

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

export const backWrapper = style([
  sprinkles({ display: 'flex', alignItems: 'center', justifyContent: 'center' }),
  {
    width: '2rem',
    height: '2rem',
    backgroundColor: tokens.colors.buttonSecondary,
    borderRadius: tokens.radius.xxs,

    ':hover': {
      backgroundColor: tokens.colors.buttonSecondaryHover,
    },

    ...responsiveStyles({
      lg: { width: '2.5rem', height: '2.5rem' },
    }),
  },
])

export const backButtonText = style({
  display: 'none',

  '@media': {
    [minWidth.lg]: {
      display: 'block',
    },
  },
})
