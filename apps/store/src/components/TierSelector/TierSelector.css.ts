import { style } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'
import { inputBgColor, inputSelectedItemBgColor } from 'ui/src/theme/vars.css'

export const root = style({
  backgroundColor: inputBgColor,
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

export const optionsList = style({
  paddingBlock: theme.space.md,
  paddingInline: theme.space.xxs,
})

export const optionsListItem = style({
  width: '100%',
  paddingInline: theme.space.sm,
  paddingBlock: theme.space.md,
  borderRadius: theme.radius.md,
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
      color: theme.colors.textPrimary,
    },
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
