import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui/src/theme'
import { inputBgColor, inputSelectedItemBgColor } from 'ui/src/theme/vars.css'

export const root = style({
  backgroundColor: inputBgColor,
  borderRadius: themeVars.radius.sm,
})

export const trigger = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: themeVars.space.sm,
  width: '100%',
  height: '4.5rem',
  borderRadius: themeVars.radius.sm,
  paddingInline: themeVars.space.md,
  ':focus-visible': {
    boxShadow: themeVars.shadow.focus,
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
  paddingBlock: themeVars.space.md,
  paddingInline: themeVars.space.xxs,
})

export const optionsListItem = style({
  width: '100%',
  paddingInline: themeVars.space.sm,
  paddingBlock: themeVars.space.md,
  borderRadius: themeVars.radius.md,
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
      color: themeVars.colors.textPrimary,
    },
  },
})

export const separator = style({
  height: 1,
  backgroundColor: themeVars.colors.borderOpaque2,
})

export const footer = style({
  paddingInline: themeVars.space.md,
  paddingBlock: themeVars.space.sm,
  textAlign: 'center',
})
