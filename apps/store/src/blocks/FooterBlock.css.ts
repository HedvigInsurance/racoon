import { style } from '@vanilla-extract/css'
import { footerBgColor } from 'ui/src/theme/vars.css'
import { minWidth, tokens } from 'ui'

export const wrapperStyle = style({
  backgroundColor: footerBgColor,
  paddingTop: tokens.space.xxl,

  // Clear floating price calculator button
  paddingBottom: tokens.space[10],
})

export const disclaimerStyle = style({
  gridColumn: '1 / -1',
  textAlign: 'center',
  '@media': {
    [minWidth.md]: {
      gridRow: 2,
      gridColumn: 'span 6',
      textAlign: 'left',
    },
    [minWidth.xxl]: {
      gridColumn: '3 / span 2',
    },
  },
})
