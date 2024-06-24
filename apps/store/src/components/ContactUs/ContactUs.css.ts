import { style, keyframes } from '@vanilla-extract/css'
import { tokens, xStack, yStack } from 'ui'
import { zIndexes } from '@/utils/zIndex'

const scaleIn = keyframes({
  from: {
    opacity: 0,
    transform: 'scale(0)',
  },
  to: {
    opacity: 1,
    transform: 'scale(1)',
  },
})

const scaleOut = keyframes({
  from: {
    opacity: 1,
    transform: 'scale(1)',
  },
  to: {
    opacity: 0,
    transform: 'scale(0)',
  },
})

export const contactUsButton = style({
  position: 'fixed',
  right: tokens.space.lg,
  bottom: tokens.space.lg,
  width: 'auto',
  zIndex: zIndexes.contactUs,
})

export const statusIcon = style({
  flex: '0 0 auto',
  display: 'inline-block',
  width: 14,
  aspectRatio: '1 / 1',
  borderRadius: '50%',
  backgroundColor: tokens.colors.signalBlueElement,
})

export const chatWindow = style({
  display: 'grid',
  gridTemplateRows: '55px 1fr',
  height: 500,
  aspectRatio: '4 / 5',
  backgroundColor: tokens.colors.offWhite,
  borderRadius: tokens.radius.md,
  transformOrigin: 'var(--radix-popover-content-transform-origin)',
  filter: 'drop-shadow(0px 1px 1px hsl(0deg 0% 0% / 0.15))',
  selectors: {
    '&[data-state=open]': {
      animation: `${scaleIn} 250ms ${tokens.transitions.easeInCubic}`,
    },
    '&[data-state=closed]': {
      animation: `${scaleOut} 250ms ${tokens.transitions.easeOutCubic}`,
    },
  },
})

export const header = style([
  xStack({ gap: 'xs', alignItems: 'center', justifyContent: 'space-between' }),
  {
    color: tokens.colors.white,
    backgroundColor: tokens.colors.black,
    paddingBlock: tokens.space.sm,
    paddingInline: tokens.space.md,
    borderTopLeftRadius: 'inherit',
    borderTopRightRadius: 'inherit',
  },
])

export const closeButton = style({
  cursor: 'pointer',
})

export const content = style([
  yStack({ gap: 'xl' }),
  {
    paddingBlock: tokens.space.xl,
    paddingInline: tokens.space.md,
    overflowY: 'auto',
  },
])
