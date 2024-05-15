import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui/src/theme'

export const productUsp = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  columnGap: themeVars.space.xs,
  paddingBlock: themeVars.space.md,

  selectors: {
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${themeVars.colors.borderTranslucent1}`,
    },
  },
})

export const checkicon = style({
  flexShrink: 0,
})
