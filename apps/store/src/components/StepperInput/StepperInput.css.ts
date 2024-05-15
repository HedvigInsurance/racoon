import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui/src/theme'

export const outerWrapper = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: themeVars.space.md,
  width: '100%',
  minHeight: '3rem',
  paddingInline: themeVars.space.md,
  borderRadius: themeVars.radius.sm,
  backgroundColor: themeVars.colors.translucent1,
  selectors: {
    '&:has(label)': {
      paddingBlock: themeVars.space.sm,
    },
  },
})

export const innerWrapper = style({
  display: 'flex',
  flexDirection: 'column',
})

export const inputLabel = style({
  fontSize: themeVars.fontSizes.xs,
  color: themeVars.colors.textTranslucentSecondary,
  userSelect: 'none',
})

export const select = style({
  fontSize: themeVars.fontSizes.xl,
  color: themeVars.colors.textPrimary,
})

export const stepButton = style({
  cursor: 'pointer',
  height: '1.5rem',
  width: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: themeVars.colors.textPrimary,
  ':disabled': {
    color: themeVars.colors.textDisabled,
  },
})
