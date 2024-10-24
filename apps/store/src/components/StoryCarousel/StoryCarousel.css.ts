import { createVar, style, keyframes } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme/theme.css'

const fill = keyframes({
  from: { width: '0%' },
  to: { width: '100%' },
})

export const storyCarousel = style({
  position: 'relative',
  width: 'min(23rem, 100%)',
  aspectRatio: '3 / 4',
  borderRadius: tokens.radius.xl,
  isolation: 'isolate',
  backgroundColor: tokens.colors.gray200,
})

export const imageSequenceProgressBar = style({
  display: 'flex',
  gap: tokens.space.xxs,
  position: 'absolute',
  top: '1rem',
  left: '1.5rem',
  right: '1.5rem',
  height: '0.25rem',
  zIndex: 1,
})

export const progressSegment = style({
  flex: 1,
  position: 'relative',
  height: '0.375rem',
  borderRadius: 4,
  backgroundColor: tokens.colors.grayTranslucent600,
  border: '1px solid hsl(0 0% 100% / 0.2)',
  '::after': {
    content: '',
    display: 'block',
    width: '0%',
    height: '100%',
    borderRadius: 'inherit',
    backgroundColor: tokens.colors.gray50,
  },
})

export const fillAnimationDuration = createVar()

export const progressSegmentFillRunning = style({
  '::after': {
    animation: `${fill} ${fillAnimationDuration} linear forwards`,
  },
})

export const progressSegmentFillFinished = style({
  '::after': {
    width: '100%',
  },
})

export const stepper = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: '20%',
  zIndex: 3,
  selectors: {
    '&[data-side="left"]': {
      left: 0,
      borderTopLeftRadius: 'inherit',
      borderBottomLeftRadius: 'inherit',
    },
    '&[data-side="right"]': {
      right: 0,
      borderTopRightRadius: 'inherit',
      borderBottomRightRadius: 'inherit',
    },
  },
})

export const img = style({
  borderRadius: 'inherit',
})
