import { style } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme/theme.css'

export const productUsp = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  columnGap: tokens.space.xs,
  paddingBlock: tokens.space.md,

  selectors: {
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${tokens.colors.borderTranslucent1}`,
    },
  },
})

export const checkicon = style({
  flexShrink: 0,
})
