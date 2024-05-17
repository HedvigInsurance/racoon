import { style, styleVariants } from '@vanilla-extract/css'
import { tokens, minWidth } from 'ui'

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
})

export const row = style({
  selectors: {
    '&:not(:last-child)': {
      borderBottom: `1px solid ${tokens.colors.borderOpaque1}`,
    },
  },
})

export const header = style({
  paddingBlock: tokens.space.sm,
  paddingInline: tokens.space.xs,
  textAlign: 'center',

  '@media': {
    [minWidth.lg]: {
      paddingBlock: tokens.space.md,
      paddingInline: tokens.space.sm,
    },
  },
})

export const activeHeader = style({
  backgroundColor: tokens.components.table.cell.background.active,
  borderTopLeftRadius: tokens.radius.xxs,
  borderTopRightRadius: tokens.radius.xxs,
})

export const cell = style({
  paddingBlock: '0.875rem',
  paddingInline: tokens.space.xxs,
  verticalAlign: 'top',
  minWidth: '2.5rem',
  color: tokens.colors.textSecondary,

  selectors: {
    [`${row}:last-child &`]: {
      borderBottomLeftRadius: tokens.radius.xxs,
      borderBottomRightRadius: tokens.radius.xxs,
    },
  },

  '@media': {
    [minWidth.lg]: {
      minWidth: '4rem',
    },
  },
})

export const activeCell = style({
  backgroundColor: tokens.components.table.cell.background.active,
})

export const aligner = styleVariants({
  left: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    // Make sure text gets centered when wrapped into multiple lines
    textAlign: 'center',
  },
  right: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
})
