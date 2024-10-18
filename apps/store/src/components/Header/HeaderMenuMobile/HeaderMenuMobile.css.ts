import { style } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme/theme.css'

export const MENU_BAR_HEIGHT_MOBILE = '3.5rem'
export const HEADER_HEIGHT_MOBILE = `calc(${MENU_BAR_HEIGHT_MOBILE} + ${tokens.space.xs})`
const MENU_TRIGGER_MOBILE_SIZE = '2.5rem'

export const contentWrapper = style({
  position: 'fixed',
  top: 0,
  width: '100%',
  color: tokens.colors.textPrimary,
})

export const buttonWrapper = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: tokens.space.xs,
  paddingTop: tokens.space.lg,
})

export const buttonTrigger = style({
  width: MENU_TRIGGER_MOBILE_SIZE,
  height: MENU_TRIGGER_MOBILE_SIZE,
  // Avoid flickering background-color on button when toggling menu on non-hover devices
  '@media': {
    '(hover: none)': {
      ':active': {
        backgroundColor: 'transparent',
      },
      ':focus-visible': {
        boxShadow: 'none',
      },
    },
  },
})

export const HeaderMenuHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: MENU_BAR_HEIGHT_MOBILE,
  paddingInline: tokens.space.md,
  gap: tokens.space.xs,
})

export const dialogOverlay = style({
  position: 'fixed',
  inset: 0,
  top: 0,
  backgroundColor: tokens.colors.light,
})
