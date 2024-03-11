import { style } from '@vanilla-extract/css'
import { theme } from 'ui'
import { MENU_BAR_HEIGHT_MOBILE } from '@/components/Header/constants'

export const header = style({
  display: 'flex',
  paddingInline: theme.space.md,
  alignItems: 'center',
  height: MENU_BAR_HEIGHT_MOBILE,

  '@media': {
    'screen and (min-width: 768px)': {
      paddingInline: theme.space.xl,
    },
  },
})
