import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const outerWrapper = style({
  display: 'flex',
  width: '100%',
  height: '4rem',
  alignItems: 'center',
  paddingInline: tokens.space.md,
  borderRadius: tokens.radius.sm,
  backgroundColor: tokens.colors.translucent1,
  selectors: {
    '&:has(label)': {
      paddingBlock: tokens.space.sm,
    },
  },
})

export const inputLabel = style({
  fontSize: tokens.fontSizes.xs,
  color: tokens.colors.textTranslucentSecondary,
  userSelect: 'none',
})

export const select = style({
  fontSize: tokens.fontSizes.xl,
  color: tokens.colors.textPrimary,
})

export const stepButton = style({
  cursor: 'pointer',
  height: '1.5rem',
  width: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: tokens.colors.textPrimary,
  ':disabled': {
    color: tokens.colors.textDisabled,
  },
})
