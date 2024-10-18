import { style, keyframes } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme/theme.css'

export const TRUSTLY_IFRAME_MAX_WIDTH = 600
const TRUSTLY_IFRAME_MIN_HEIGHT = 500
export const TRUSTLY_IFRAME_MAX_HEIGHT = 800

const pulseAnimation = keyframes({
  '0%': { opacity: 1 },
  '50%': { opacity: 0.5 },
  '100%': { opacity: 1 },
})

export const trustlyIframeBaseStyles = style({
  width: '100%',
  maxWidth: TRUSTLY_IFRAME_MAX_WIDTH,
  minHeight: TRUSTLY_IFRAME_MIN_HEIGHT,
  height: '100%',
  maxHeight: TRUSTLY_IFRAME_MAX_HEIGHT,
  borderRadius: 16,
  boxShadow: tokens.shadow.default,
  marginInline: 'auto',
  backgroundColor: tokens.colors.white,
})

export const trustlyIframe = style([
  trustlyIframeBaseStyles,
  {
    display: 'block',
    border: 'none',
    selectors: {
      '&[data-loading=true]': {
        backgroundColor: tokens.colors.gray200,
        animation: `${pulseAnimation} 2s`,
        animationIterationCount: 3,
      },
    },
  },
])
