import { style, keyframes } from '@vanilla-extract/css'
import { minWidth, tokens } from 'ui'
import { MAX_WIDTH } from '../GridLayout/GridLayout.constants'
import { MENU_BAR_HEIGHT_DESKTOP } from '../HeaderNew/Header.css'
import { MENU_BAR_HEIGHT_MOBILE } from '../HeaderNew/HeaderMenuMobile/HeaderMenuMobile.css'

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

export const styledOverlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'hsla(0, 0%, 0%, 0.15)',
  '@media': {
    '(prefers-reduced-motion: no-preference)': {
      animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
    },
  },
})

export const contentWrapper = style({
  position: 'fixed',
  inset: 0,
  maxWidth: MAX_WIDTH,
  marginInline: 'auto',
  paddingInline: tokens.space.md,

  '@media': {
    [minWidth.lg]: {
      paddingInline: tokens.space.lg,
    },
  },
})

export const dialogContentWrapper = style({
  position: 'absolute',
  top: MENU_BAR_HEIGHT_MOBILE,
  right: tokens.space.md,
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.space.lg,
  width: `calc(100% - ${tokens.space.md} - ${tokens.space.md})`,
  maxWidth: '28rem',
  paddingTop: tokens.space.lg,
  paddingInline: tokens.space.md,
  paddingBottom: tokens.space.xs,
  borderRadius: tokens.radius.xl,
  border: `1px solid ${tokens.colors.borderTranslucent1}`,
  backgroundColor: tokens.colors.light,
  boxShadow: tokens.shadow.card,

  '@media': {
    [minWidth.lg]: {
      top: MENU_BAR_HEIGHT_DESKTOP,
      right: tokens.space.lg,
      paddingInline: tokens.space.lg,
    },
  },
})
