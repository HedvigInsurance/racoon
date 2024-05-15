import { createVar, keyframes, style } from '@vanilla-extract/css'
import { hoverStyles, minWidth, tokens } from 'ui'

export const videoWrapper = style({
  position: 'relative',
})

export const heightPortraitVar = createVar()
export const maxHeightPortraitVar = createVar()
export const aspectRatioPortraitVar = createVar()
export const heightLandscapeVar = createVar()
export const maxHeightLandscapeVar = createVar()
export const aspectRatioLandscapeVar = createVar()

export const videoBase = style({
  width: '100%',
  objectFit: 'cover',
  '@media': {
    '(orientation: portrait)': {
      height: heightPortraitVar,
      maxHeight: maxHeightPortraitVar,
      aspectRatio: aspectRatioPortraitVar,
    },
    '(orientation: landscape)': {
      aspectRatio: aspectRatioLandscapeVar,
      height: heightLandscapeVar,
      maxHeight: maxHeightLandscapeVar,
    },
  },
})

export const videoRoundedCorners = style({
  borderRadius: tokens.radius.md,

  '@media': {
    [minWidth.lg]: {
      borderRadius: tokens.radius.xl,
    },
  },
})

export const videoControls = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: tokens.space.md,
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  cursor: 'pointer',
})

export const videoControlsVisibility = style({
  display: 'flex',
  gap: tokens.space.xs,
  width: '100%',

  '@media': {
    '(hover: hover)': {
      opacity: 0,
      visibility: 'hidden',
      transition: 'all 200ms cubic-bezier(0, 0, 0.2, 1) 2s',
      selectors: {
        [`${videoControls}[data-state="paused"] > &, ${videoControls}:hover > &`]: {
          opacity: 1,
          visibility: 'visible',
          transitionDelay: '0s',
        },
      },
    },
  },
})

export const controlButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: tokens.space.xs,
  height: '2rem',
  paddingInline: tokens.space.xs,
  backgroundColor: tokens.colors.grayTranslucentDark700,

  ...hoverStyles({
    backgroundColor: tokens.colors.grayTranslucentDark600,
  }),

  ':active': {
    backgroundColor: tokens.colors.grayTranslucentDark600,
  },
})

export const soundBarsAnimation = keyframes({
  '50%': { opacity: 0.2, transform: 'scaleY(.2)' },
  '100%': { opacity: 1, transform: 'scaleY(0.9)' },
})

export const soundBars = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '16px',
  width: '16px',
  paddingBottom: '2px',
})

export const soundBar = style({
  margin: 'auto 1px 0',
  height: '14px',
  width: '2px',
  borderRadius: '2px',
  transformOrigin: 'bottom',
  backgroundColor: tokens.colors.gray1000,
  transition: 'all .4s ease-in-out',
  animation: `${soundBarsAnimation} 1s 2 alternate`,

  selectors: {
    '&:first-of-type': { transform: 'scaleY(.85)', animationDelay: '.4s' },
    '&:nth-of-type(2)': { transform: 'scaleY(.43)', animationDelay: '.2s' },
    '&:nth-of-type(3)': { transform: 'scaleY(.72)', animationDelay: '.6s' },

    // vanilla-extract doesn't support nesting with pseudo selectors
    [`${videoControls}[data-muted=false]${videoControls}[data-state="playing"] &`]: {
      animation: `${soundBarsAnimation} 1s infinite alternate`,
    },

    [`${videoControls}[data-muted=false]${videoControls}[data-state="playing"] &:first-of-type`]: {
      transform: 'scaleY(.85)',
      animationDelay: '.4s',
    },
    [`${videoControls}[data-muted=false]${videoControls}[data-state="playing"] &:nth-of-type(2)`]: {
      transform: 'scaleY(.43)',
      animationDelay: '.2s',
    },
    [`${videoControls}[data-muted=false]${videoControls}[data-state="playing"] &:nth-of-type(3)`]: {
      transform: 'scaleY(.72)',
      animationDelay: '.6s',
    },
  },
})
