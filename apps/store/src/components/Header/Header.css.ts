import { style } from '@vanilla-extract/css'
import { minWidth, theme } from 'ui'
import { MENU_BAR_HEIGHT_DESKTOP, MENU_BAR_HEIGHT_MOBILE } from './Header.constants'

export const rawFocusableStyles = {
  cursor: 'pointer',
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.gray900}`,
  },
}

export const focusableStyles = style({
  cursor: 'pointer',

  ':focus-visible': {
    outline: `2px solid ${theme.colors.gray900}`,
  },
})

export const navigation = style({
  fontSize: theme.fontSizes.xl,

  '@media': {
    [minWidth.lg]: {
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
    [minWidth.lg]: {
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
      [minWidth.lg]: {
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

export const navigationSecondaryItem = style({
  padding: `${theme.space.md} ${theme.space.md} `,
  marginLeft: theme.space.md,
  color: theme.colors.textPrimary,

  '@media': {
    [minWidth.lg]: {
      padding: `${theme.space.xs} ${theme.space.sm}`,
      margin: 0,
      borderRadius: theme.radius.sm,

      ':hover': {
        backgroundColor: theme.colors.grayTranslucent100,
      },
    },
  },
})

export const navigationContent = style({
  '@media': {
    [minWidth.lg]: {
      position: 'absolute',
      paddingTop: `calc(${theme.space.sm} + ${theme.space.xs})`,
    },
  },
})

export const navigationMenuWrapper = style({
  paddingBottom: theme.space.xl,

  '@media': {
    [minWidth.lg]: {
      backgroundColor: theme.colors.light,
      boxShadow: theme.shadow.default,
      borderRadius: theme.radius.sm,
      padding: theme.space.md,
    },
  },
})

export const navigationPrimaryList = style({
  all: 'unset',
  listStyle: 'none',
  position: 'fixed',
  inset: `${MENU_BAR_HEIGHT_MOBILE} 0 0 0`,
  display: 'flex',
  flexDirection: 'column',
  paddingInline: theme.space.md,
  paddingBottom: theme.space.xl,
  overflowY: 'auto',

  '@media': {
    [minWidth.lg]: {
      position: 'static',
      flexDirection: 'row',
      alignItems: 'center',
      height: MENU_BAR_HEIGHT_DESKTOP,
      padding: theme.space.none,
      gap: theme.space.xxs,
    },
  },
})

export const navigationSecondaryList = style({
  display: 'block',

  '@media': {
    [minWidth.lg]: {
      padding: 0,
    },
  },
})

export const navigationProductList = style({
  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.space.xs,
  fontSize: theme.fontSizes.md,
  color: theme.colors.textPrimary,

  '@media': {
    [minWidth.lg]: {
      minWidth: '16rem',
      columnGap: 0,
      gridTemplateColumns: 'none',
      gridAutoColumns: '7.5rem',
      gridAutoFlow: 'column',
    },
  },
})
