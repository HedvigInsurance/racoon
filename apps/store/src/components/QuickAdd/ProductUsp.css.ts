import { style } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'

export const productUsp = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  columnGap: theme.space.xs,
  paddingBlock: theme.space.md,

  selectors: {
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${theme.colors.borderTranslucent1}`,
    },
  },
})

export const checkicon = style({
  flexShrink: 0,
})
