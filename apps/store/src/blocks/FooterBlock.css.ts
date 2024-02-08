import { style } from '@vanilla-extract/css'
import { minWidth, theme } from 'ui/src/theme'

export const wrapperStyle = style({
  backgroundColor: theme.colors.gray100,
  paddingTop: theme.space.xxl,

  // Clear floating price calculator button
  paddingBottom: theme.space[10],
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
