import { style, styleVariants } from '@vanilla-extract/css'
import { tokens, minWidth } from 'ui'

const TRIGGER_ICON_SIZE = '1rem'
const TRIGGER_ICON_GAP = '1rem'

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
  borderTopLeftRadius: tokens.radius.md,
  borderTopRightRadius: tokens.radius.md,
})

export const cell = style({
  paddingBlock: '0.875rem',
  paddingInline: tokens.space.xs,
  verticalAlign: 'top',

  selectors: {
    [`${row}:last-child &`]: {
      borderBottomLeftRadius: tokens.radius.md,
      borderBottomRightRadius: tokens.radius.md,
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

export const collapisableTrigger = style({
  display: 'flex',
  alignItems: 'center',
  gap: TRIGGER_ICON_GAP,
  width: '100%',
})

export const collapisableContent = style({
  maxWidth: '45ch',
  paddingLeft: `calc(${TRIGGER_ICON_SIZE} + ${TRIGGER_ICON_GAP})`,
})

export const triggerIcon = style({
  flexShrink: 0,
  width: TRIGGER_ICON_SIZE,
  aspectRatio: '1',
  transition: 'transform 300ms',
  selectors: {
    '[data-state=open] &': { transform: 'rotate(180deg)' },
    '[data-state=closed] &': { transform: 'rotate(0deg)' },
  },
})
