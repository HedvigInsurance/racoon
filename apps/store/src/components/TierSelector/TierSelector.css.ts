import { style, keyframes } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'

// TODO: unify accordion animation with the one in the block
const slideDown = keyframes({
  from: {
    height: 0,
  },
  to: {
    // custom property reference: https://www.radix-ui.com/docs/primitives/components/collapsible
    height: 'var(--radix-collapsible-content-height)',
  },
})

const slideUp = keyframes({
  from: {
    height: 'var(--radix-collapsible-content-height)',
  },
  to: {
    height: 0,
  },
})

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
  cursor: 'pointer',
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

export const content = style({
  overflow: 'hidden',
  selectors: {
    '[data-state=open] &': {
      animation: `${slideDown} 400ms cubic-bezier(0.65,0.05,0.36,1)`,
    },
    '[data-state=closed] &': {
      animation: `${slideUp} 400ms cubic-bezier(0.65,0.05,0.36,1)`,
    },
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
