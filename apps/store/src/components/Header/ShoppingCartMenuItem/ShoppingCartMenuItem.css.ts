import { style } from '@vanilla-extract/css'
import { responsiveStyles, tokens } from 'ui'
import { displayMobileMenu } from '../HeaderMenu/HeaderMenu.css'

export const wrapper = style({
  // Hide shopping cart if mobile menu is hidden
  display: displayMobileMenu,
  // Align to the right in the header
  marginLeft: 'auto',
  lineHeight: 0,

  ...responsiveStyles({
    lg: {
      // Always visible in desktop
      display: 'block',
    },
  }),
})

export const cartLink = style({
  display: 'inline-block',
  borderRadius: tokens.radius.sm,

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

export const shoppingBagIconLight = style({
  color: tokens.colors.grayTranslucent200,
  selectors: {
    [`${cartLink}:hover &`]: {
      color: tokens.colors.grayTranslucent300,
    },
  },
})

export const shoppingBagIconGreen = style({
  color: tokens.colors.green100,
  selectors: {
    [`${cartLink}:hover &`]: {
      color: tokens.colors.green200,
    },
  },
})

export const cartCount = style({
  position: 'absolute',
  // Center vertically
  marginTop: -1,
})
