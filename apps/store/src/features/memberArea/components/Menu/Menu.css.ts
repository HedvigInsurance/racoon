import { style } from '@vanilla-extract/css'
import { minWidth, tokens } from 'ui'

export const navigation = style({
  paddingInline: tokens.space.md,
  paddingBottom: tokens.space.sm,

  '@media': {
    [minWidth.lg]: {
      paddingInline: tokens.space.xl,
    },
  },
})

export const memberInfo = style({
  display: 'none',
  '@media': {
    [minWidth.lg]: {
      display: 'block',
      width: '100%',
      marginBottom: tokens.space.lg,
      lineHeight: 1.33,
    },
  },
})

export const navigationList = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: tokens.space.xs,
  flexWrap: 'wrap',

  '@media': {
    [minWidth.lg]: {
      flexDirection: 'column',
      gap: tokens.space.md,
      width: '100%',
    },
  },
})

export const navigationItem = style({
  display: 'flex',
  '@media': {
    [minWidth.lg]: {
      width: '100%',
    },
  },
})

export const navigationLink = style({
  display: 'flex',
  alignItems: 'center',
  height: '2.5rem',
  padding: tokens.space.sm,
  borderRadius: tokens.radius.sm,
  whiteSpace: 'nowrap',
  fontSize: tokens.fontSizes.md,

  '@media': {
    [minWidth.lg]: {
      width: '100%',
      height: '3rem',
    },
    '(hover: hover)': {
      ':hover': {
        backgroundColor: tokens.colors.grayTranslucent100,
      },
    },
  },

  selectors: {
    '&[data-active="true"]': {
      backgroundColor: tokens.colors.grayTranslucent100,
    },
  },
})

export const navigationButton = style({
  color: tokens.colors.signalRedElement,
  cursor: 'pointer',
})

export const navItemSkeleton = style({
  width: '165px',
  height: '2.5rem',

  selectors: {
    '&:nth-child(even)': { width: '98px' },
  },

  '@media': {
    [minWidth.lg]: {
      width: '100%',
      height: '3rem',
    },
  },
})
