import { style } from '@vanilla-extract/css'
import { tokens, minWidth, xStack } from 'ui'
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
        borderRadius: tokens.radius.md,

        ':hover': {
          backgroundColor: tokens.colors.grayTranslucent100,
        },
      },
    },
  },
])

export const productNavigationLinkCard = style([
  focusableStyles,
  xStack({ gap: 'xs', alignItems: 'center' }),
  {
    position: 'relative',
    flexShrink: 0,
    paddingBlock: tokens.space.xs,
    paddingInline: tokens.space.xxs,

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
    display: 'block',
    alignSelf: 'center',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    width: '100%',
    paddingBlock: tokens.space.xxs,
    paddingLeft: tokens.space.lg,
    paddingRight: tokens.space.md,

    '@media': {
      [minWidth.lg]: {
        padding: tokens.space.sm,
      },
    },
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
