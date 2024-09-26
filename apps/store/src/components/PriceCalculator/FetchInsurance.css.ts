import { style } from '@vanilla-extract/css'
import { tokens, xStack } from 'ui'
import {
  INSURELY_IFRAME_MAX_HEIGHT,
  INSURELY_IFRAME_MAX_WIDTH,
} from '@/services/Insurely/Insurely.constants'

export const dialogWindow = style({
  padding: tokens.space.md,
  paddingTop: tokens.space.lg,
  borderRadius: tokens.radius.xxs,
  width: `calc(100% - ${tokens.space.xs} * 2)`,
  maxWidth: '28rem',
  marginInline: 'auto',
})

export const dialogContent = style({
  width: '100%',
  alignSelf: 'center',
})

export const dialogIframeContent = style({
  width: '100%',
  maxWidth: INSURELY_IFRAME_MAX_WIDTH,

  '@media': {
    [`(min-height: ${INSURELY_IFRAME_MAX_HEIGHT}px)`]: {
      alignSelf: 'center',
    },
  },
})

export const dialogIframeWindow = style({
  width: '100%',
  maxHeight: '100%',
  height: INSURELY_IFRAME_MAX_HEIGHT,
  overflowY: 'auto',
  borderRadius: tokens.radius.xxs,
})

export const actions = style([
  xStack({ justifyContent: 'center' }),
  { marginBottom: tokens.space.xl },
])
