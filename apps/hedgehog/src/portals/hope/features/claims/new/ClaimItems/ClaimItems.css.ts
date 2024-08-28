import { minWidth, theme } from '@hedvig-ui/redesign/theme'
import { style } from '@vanilla-extract/css'

export const itemsContainer = style({
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: 'repeat(auto-fill, 1fr)',
  marginTop: theme.space.md,

  '@media': {
    [minWidth.lg]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(calc(50% - 1rem), 1fr))',
    },
  },
})

export const itemDataPoints = style({
  marginTop: theme.space.lg,
  color: theme.colors.textSecondary,
})

export const calculationSection = style({
  marginTop: theme.space.lg,
  paddingTop: theme.space.lg,
  borderTop: `1px solid ${theme.colors.borderOpaque2}`,
  color: theme.colors.textSecondary,
})

export const compensationSection = style({
  color: 'unset',
})
