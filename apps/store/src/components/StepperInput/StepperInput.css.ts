import { style } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'

export const outerWrapper = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.space.md,
  width: '100%',
  minHeight: '3rem',
  paddingInline: theme.space.md,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.translucent1,
  selectors: {
    '&:has(label)': {
      paddingBlock: theme.space.sm,
    },
  },
})

export const innerWrapper = style({
  display: 'flex',
  flexDirection: 'column',
})

export const inputLabel = style({
  fontSize: theme.fontSizes.xs,
  color: theme.colors.textTranslucentSecondary,
  userSelect: 'none',
})

export const select = style({
  fontSize: theme.fontSizes.xl,
  color: theme.colors.textPrimary,
})

export const stepButton = style({
  cursor: 'pointer',
  height: '1.5rem',
  width: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})
