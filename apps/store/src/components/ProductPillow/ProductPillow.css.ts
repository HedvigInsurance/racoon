import { style } from '@vanilla-extract/css'
import { minWidth, theme } from 'ui/src/theme'

export const link = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.space.sm,
  padding: `${theme.space.sm} ${theme.space.md}`,
  borderRadius: theme.radius.sm,

  ':focus': {
    backgroundColor: theme.colors.grayTranslucent100,
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
