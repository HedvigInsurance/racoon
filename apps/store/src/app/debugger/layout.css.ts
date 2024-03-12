import { style } from '@vanilla-extract/css'
import { minWidth, theme } from 'ui'
import { MENU_BAR_HEIGHT_MOBILE } from '@/components/Header/Header.constants'

export const header = style({
  display: 'flex',
  paddingInline: theme.space.md,
  alignItems: 'center',
  height: MENU_BAR_HEIGHT_MOBILE,

  '@media': {
    [minWidth.lg]: {
      paddingInline: theme.space.xl,
    },
  },
})
