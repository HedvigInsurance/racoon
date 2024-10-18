import { style } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme/theme.css'

export const tabsRoot = style({
  paddingInline: tokens.space.xs,
  marginInline: 'auto',
  width: 'min(100%, 21.875rem)',
})

export const tabsList = style({
  display: 'flex',
  gap: tokens.space.xs,
  paddingBottom: tokens.space.sm,
  overflowX: 'auto',
})

export const tabButton = style({
  flex: 1,
  selectors: {
    '&[data-state=active]': {
      backgroundColor: tokens.components.table.cell.background.active,
    },
  },
})
