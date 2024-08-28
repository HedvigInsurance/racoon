import { keyframes, style } from '@vanilla-extract/css'
import { theme } from '../theme'

const SLIDE_LENGHT = theme.space.xs

const slideUpAndFade = keyframes({
  from: {
    opacity: 0,
    transform: `translateY(${SLIDE_LENGHT})`,
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
})
const slideRightAndFade = keyframes({
  from: {
    opacity: 0,
    transform: `translateX(-${SLIDE_LENGHT})`,
  },
  to: {
    opacity: 1,
    transform: 'translateX(0)',
  },
})
const slideDownAndFade = keyframes({
  from: {
    opacity: 0,
    transform: `translateY(-${SLIDE_LENGHT})`,
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
})
const slideLeftAndFade = keyframes({
  from: {
    opacity: 0,
    transform: `translateX(${SLIDE_LENGHT})`,
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
})

export const css = {
  TooltipContent: style({
    paddingBlock: theme.space.xs,
    paddingInline: theme.space.md,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.gray1000,
    color: theme.colors.offWhite,
    transformOrigin: 'var(--radix-tooltip-content-transform-origin)',
    animationDuration: '0.3s',
    animationTimingFunction: 'ease-out',
    zIndex: 2000,
    whiteSpace: 'pre-wrap',

    selectors: {
      '&[data-side="top"]': {
        animationName: slideUpAndFade,
      },
      '&[data-side="right"]': {
        animationName: slideRightAndFade,
      },
      '&[data-side="bottom"]': {
        animationName: slideDownAndFade,
      },
      '&[data-side="left"]': {
        animationName: slideLeftAndFade,
      },
    },
  }),
}
