import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui/src/theme'
import { MENU_BAR_HEIGHT_MOBILE } from '@/components/Header/Header.constants'

export const contentWrapper = style({
  position: 'fixed',
  top: 0,
  width: '100%',
  color: themeVars.colors.textPrimary,
})

export const buttonWrapper = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: themeVars.space.xs,
  paddingTop: themeVars.space.lg,
})

export const buttonTrigger = style({
  // Avoid flickering background-color on button when toggling menu on non-hover devices
  '@media': {
    '(hover: none)': {
      ':active': {
        backgroundColor: 'transparent',
      },
    },
  },
})

export const topMenuHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: MENU_BAR_HEIGHT_MOBILE,
  paddingInline: themeVars.space.md,
  gap: themeVars.space.xs,
})

export const dialogOverlay = style({
  position: 'fixed',
  inset: 0,
  top: 0,
  backgroundColor: themeVars.colors.light,
})
