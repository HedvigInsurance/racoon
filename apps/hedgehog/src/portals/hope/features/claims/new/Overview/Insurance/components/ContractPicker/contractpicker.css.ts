import { theme } from '@hedvig-ui/redesign/theme'
import { style } from '@vanilla-extract/css'

export const picker = style({
  width: '400px',
  maxHeight: '600px',
  overflowY: 'scroll',
})

export const pickerOption = style({
  cursor: 'pointer',
  padding: theme.space.md,

  transition: 'background-color 0.2s',

  selectors: {
    '&:hover': {
      backgroundColor: theme.colors.opaque1,
    },
    '&:not(:last-child)': {
      borderBottom: `1px solid ${theme.colors.borderTranslucent1}`,
    },
  },
})

export const optionTitle = style({
  fontSize: theme.fontSizes.lg,
})
