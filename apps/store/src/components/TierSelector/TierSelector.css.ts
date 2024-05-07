import { style } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'

export const root = style({
  backgroundColor: theme.colors.translucent1,
  borderRadius: theme.radius.sm,
})

export const trigger = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.sm,
  width: '100%',
  height: '4.5rem',
  borderRadius: theme.radius.sm,
  paddingInline: theme.space.md,
  ':focus-visible': {
    boxShadow: theme.shadow.focus,
  },
})

export const triggerIcon = style({
  flexShrink: 0,
  transition: 'transform 300ms',
  selectors: {
    '[data-state=open] &': { transform: 'rotate(180deg)' },
  },
})

export const separator = style({
  height: 1,
  backgroundColor: theme.colors.borderOpaque2,
})

export const footer = style({
  paddingInline: theme.space.md,
  paddingBlock: theme.space.sm,
  textAlign: 'center',
})
