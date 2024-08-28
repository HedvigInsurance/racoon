import { style } from '@vanilla-extract/css'
import { theme } from '@hedvig-ui/redesign/theme'

export const radio = style({
  appearance: 'none',
  backgroundColor: 'transparent',
  margin: 0,
  width: 24,
  aspectRatio: '1',
  border: '2px solid',
  borderColor: theme.colors.borderTranslucent1,
  borderRadius: '50%',
  cursor: 'pointer',
  selectors: {
    ['&:checked']: {
      backgroundColor: theme.colors.textPrimary,
    },
  },
})

export const label = style({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xs,
  cursor: 'pointer',
})
