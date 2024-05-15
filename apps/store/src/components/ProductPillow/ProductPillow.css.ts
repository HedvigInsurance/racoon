import { style } from '@vanilla-extract/css'
import { minWidth, themeVars } from 'ui/src/theme'

export const link = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: themeVars.space.sm,
  padding: `${themeVars.space.sm} ${themeVars.space.md}`,
  borderRadius: themeVars.radius.sm,

  ':focus': {
    backgroundColor: themeVars.colors.grayTranslucent100,
  },
})

export const pillow = style({
  '@media': {
    [minWidth.lg]: {
      height: '6rem',
      width: '6rem',
    },
  },
})
