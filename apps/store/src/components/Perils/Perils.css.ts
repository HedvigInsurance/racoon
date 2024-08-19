import { style } from '@vanilla-extract/css'
import { minWidth, tokens, xStack, yStack } from 'ui'

export const disabledPeril = style({
  backgroundColor: tokens.colors.opaque1,
  borderRadius: tokens.radius.sm,
  paddingInline: tokens.space.md,
  paddingBlock: tokens.space.sm,
  cursor: 'not-allowed',

  '@media': {
    [minWidth.lg]: {
      paddingInline: tokens.space.lg,
      paddingBlock: tokens.space.md,
    },
  },
})

export const grid = style({
  display: 'grid',
  gap: tokens.space.xxs,
  gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
  // We're not expecting to have multiple rows, but if we do as a result of miscalculation,
  // row gap prevents perils from sticking together
  rowGap: tokens.space.xs,
  '@media': {
    [minWidth.md]: {
      columnGap: tokens.space.md,
    },
  },
})

export const column = style([
  yStack({ gap: 'xxs' }),
  {
    '@media': {
      [minWidth.md]: {},
    },
  },
])

export const header = style([
  xStack({ gap: 'sm', alignItems: 'center' }),
  {
    flexGrow: 1,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
])

export const colorIcon = style({
  flexShrink: 0,
  width: '1rem',
  height: '1rem',
  borderRadius: '50%',
})

export const triggerText = style({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',

  selectors: {
    '[data-state=open] &': { whiteSpace: 'normal' },
  },
})

export const contentWrapper = style([
  yStack({ gap: 'md' }),
  {
    paddingLeft: '1.75rem',
    paddingBottom: tokens.space.md,
    fontSize: tokens.fontSizes.xs,

    '@media': {
      [minWidth.lg]: {
        paddingTop: tokens.space.xs,
        paddingBottom: tokens.space.lg,
      },
    },
  },
])
