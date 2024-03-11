import { style } from '@vanilla-extract/css'
import { theme, vanillaMQ } from 'ui'
import { focusableStyles } from '../Header.css'

export const navigationLink = style([
  focusableStyles,
  {
    display: 'block',
    paddingBlock: theme.space.lg,

    [vanillaMQ.lg]: {
      paddingBlock: theme.space.xs,
      paddingInline: theme.space.md,
      borderRadius: theme.radius.sm,

      ':hover': {
        backgroundColor: theme.colors.grayTranslucent100,
      },
    },
  },
])

export const productNavigationLinkCard = style([
  focusableStyles,
  {
    display: 'flex',
    columnGap: theme.space.sm,
    placeItems: 'center',
    flexShrink: 0,
    paddingBlock: theme.space.xs,
    position: 'relative',

    '@media': {
      [vanillaMQ.lg]: {
        columnGap: theme.space.xs,
        paddingInline: theme.space.xs,
        borderRadius: theme.radius.sm,

        ':hover': {
          backgroundColor: theme.colors.grayTranslucent100,
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
