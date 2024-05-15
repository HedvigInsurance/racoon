import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'
import { MENU_BAR_HEIGHT_MOBILE } from '@/components/Header/Header.constants'

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
  paddingInline: tokens.space.md,
  gap: tokens.space.xs,
})

export const dialogOverlay = style({
  position: 'fixed',
  inset: 0,
  top: 0,
  backgroundColor: tokens.colors.light,
})
