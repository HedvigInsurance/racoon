import { style } from '@vanilla-extract/css'
import { theme } from '@hedvig-ui/redesign/theme'

export const checkboxStack = style({
  display: 'grid',
  placeItems: 'center',
  gridTemplateAreas: 'checkbox-stack',
})

export const checkbox = style({
  appearance: 'none',
  backgroundColor: 'transparent',
  margin: 0,
  width: 24,
  aspectRatio: '1',
  border: '2px solid',
  borderColor: theme.colors.borderTranslucent1,
  borderRadius: theme.radius.xxs,
  cursor: 'pointer',
  gridArea: 'checkbox-stack',
  selectors: {
    ['&:checked']: {
      backgroundColor: theme.colors.textPrimary,
    },
    ['&:disabled']: {
      backgroundColor: theme.colors.opaque2,
    },
  },
})

export const label = style({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xs,
  cursor: 'pointer',

  selectors: {
    '&:has(input:disabled)': {
      pointerEvents: 'none',
    },
  },
})

export const checkmark = style({
  gridArea: 'checkbox-stack',
})
