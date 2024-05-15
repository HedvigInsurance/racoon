import { style } from '@vanilla-extract/css'
import { themeVars, minWidth } from 'ui'
import { focusableStyles } from '../Header.css'

export const navigationLink = style([
  focusableStyles,
  {
    display: 'block',
    paddingBlock: themeVars.space.lg,

    '@media': {
      [minWidth.lg]: {
        paddingBlock: themeVars.space.xs,
        paddingInline: themeVars.space.md,
        borderRadius: themeVars.radius.sm,

        ':hover': {
          backgroundColor: themeVars.colors.grayTranslucent100,
        },
      },
    },
  },
])

export const productNavigationLinkCard = style([
  focusableStyles,
  {
    display: 'flex',
    columnGap: themeVars.space.sm,
    placeItems: 'center',
    flexShrink: 0,
    paddingBlock: themeVars.space.xs,
    position: 'relative',

    '@media': {
      [minWidth.lg]: {
        columnGap: themeVars.space.xs,
        paddingInline: themeVars.space.xs,
        borderRadius: themeVars.radius.sm,

        ':hover': {
          backgroundColor: themeVars.colors.grayTranslucent100,
        },
      },
    },
  },
])

export const secondaryNavigationLink = style([
  focusableStyles,
  {
    alignSelf: 'center',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
])

export const expandingLink = style({
  // Make the whole card clickable - CallToAction height
  '::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
  },
})
