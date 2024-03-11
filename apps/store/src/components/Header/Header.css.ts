import { style } from '@vanilla-extract/css'
import { theme, vanillaMQ } from 'ui'

export const focusableStyles = style({
  cursor: 'pointer',

  ':focus-visible': {
    outline: `2px solid ${theme.colors.gray900}`,
  },
})

export const navigation = style({
  fontSize: theme.fontSizes.xl,

  '@media': {
    [vanillaMQ.lg]: {
      fontSize: theme.fontSizes.md,
      top: 0,
    },
  },
})

export const navigationItem = style({
  selectors: {
    '&:not(:last-child)': {
      borderBottom: `1px solid ${theme.colors.borderOpaque1}`,
    },
  },

  '@media': {
    [vanillaMQ.lg]: {
      selectors: {
        '&&': { borderBottom: 'unset' },
      },
    },
  },
})

export const navigationTriggerLink = style([
  focusableStyles,
  {
    paddingBlock: theme.space.lg,
    display: 'flex',
    alignItems: 'center',
    gap: theme.space.xxxl,
    whiteSpace: 'nowrap',

    '@media': {
      [vanillaMQ.lg]: {
        paddingBlock: theme.space.xs,
        paddingInline: theme.space.md,

        borderRadius: theme.radius.sm,

        ':hover': {
          backgroundColor: theme.colors.grayTranslucent100,
        },

        selectors: {
          '&[data-state="open"]': {
            backgroundColor: theme.colors.grayTranslucent100,
          },
        },
      },
    },
  },
])
