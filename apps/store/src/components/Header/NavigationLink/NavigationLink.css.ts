import { style } from '@vanilla-extract/css'
import { tokens, minWidth } from 'ui'
import { focusableStyles } from '../Header.css'

export const navigationLink = style([
  focusableStyles,
  {
    display: 'block',
    paddingBlock: tokens.space.lg,

    '@media': {
      [minWidth.lg]: {
        paddingBlock: tokens.space.xs,
        paddingInline: tokens.space.md,
        borderRadius: tokens.radius.sm,

        ':hover': {
          backgroundColor: tokens.colors.grayTranslucent100,
        },
      },
    },
  },
])

export const productNavigationLinkCard = style([
  focusableStyles,
  {
    display: 'flex',
    columnGap: tokens.space.sm,
    placeItems: 'center',
    flexShrink: 0,
    paddingBlock: tokens.space.xs,
    position: 'relative',

    '@media': {
      [minWidth.lg]: {
        columnGap: tokens.space.xs,
        paddingInline: tokens.space.xs,
        borderRadius: tokens.radius.sm,

        ':hover': {
          backgroundColor: tokens.colors.grayTranslucent100,
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
