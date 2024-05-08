import { style } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'

export const root = style({
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.sm,
})

export const trigger = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  textAlign: 'center',
  width: '100%',
  height: '3rem',
  borderRadius: theme.radius.xxs,
  paddingInline: theme.space.md,
})

export const triggerBody = style({
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'space-between',
  width: '100%',
  paddingRight: theme.space.md,
})

export const triggerIcon = style({
  transition: 'transform 300ms',
  selectors: {
    '[data-state=open] &': { transform: 'rotate(180deg)' },
  },
})

export const separator = style({
  height: 1,
  marginInline: theme.space.md,
  backgroundColor: theme.colors.borderOpaque2,
})

export const footer = style({
  paddingInline: theme.space.md,
  paddingBlock: theme.space.sm,
})
