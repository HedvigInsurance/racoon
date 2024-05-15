import { style } from '@vanilla-extract/css'
import { inputBgColor, inputSelectedItemBgColor } from 'ui/src/theme/vars.css'
import { tokens } from 'ui'

export const root = style({
  backgroundColor: inputBgColor,
  borderRadius: tokens.radius.sm,
})

export const trigger = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: tokens.space.sm,
  width: '100%',
  height: '4.5rem',
  borderRadius: tokens.radius.sm,
  paddingInline: tokens.space.md,
  ':focus-visible': {
    boxShadow: tokens.shadow.focus,
  },
})

export const triggerIcon = style({
  flexShrink: 0,
  transition: 'transform 300ms',
  selectors: {
    '[data-state=open] &': { transform: 'rotate(180deg)' },
  },
})

export const optionsList = style({
  paddingBlock: tokens.space.md,
  paddingInline: tokens.space.xxs,
})

export const optionsListItem = style({
  width: '100%',
  paddingInline: tokens.space.sm,
  paddingBlock: tokens.space.md,
  borderRadius: tokens.radius.md,
  cursor: 'pointer',
  selectors: {
    '&[data-state=checked]': {
      backgroundColor: inputSelectedItemBgColor,
    },
  },
})

export const optionsListItemHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
})

export const optionsListItemPrice = style({
  selectors: {
    '[data-state=checked] &': {
      color: tokens.colors.textPrimary,
    },
  },
})

export const separator = style({
  height: 1,
  backgroundColor: tokens.colors.borderOpaque2,
})

export const footer = style({
  paddingInline: tokens.space.md,
  paddingBlock: tokens.space.sm,
  textAlign: 'center',
})
