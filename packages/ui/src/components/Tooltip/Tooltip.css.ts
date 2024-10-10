import { keyframes, style } from '@vanilla-extract/css'
import { tokens } from '../../theme'

export const trigger = style({
  position: 'relative',

  '::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
  },

  '@media': {
    '(pointer: coarse)': {
      '::after': {
        vars: {
          // 44px --> minimal tap target size recommended by Apple
          '--click-target-minimum': '2.75rem',

          // Will evaluate to the number of pixels needed so the tap target is at least 44px.
          // Consider the following example:
          // width: 60px and height: 24px
          // left/right = min(0px, calc((60px - 44px) / 2)) = min(0px, 8px) = 0px
          // top/bottom = min(0px, calc((24px - 44px) / 2)) = min(0px, -10px) = -10px
          // So the tap target will be 60px x 44px
          '--inset-by': 'min(0px, calc((100% - var(--click-target-minimum)) / 2))',
        },

        inset: 'var(--inset-by)',
      },
    },
  },
})

const slideUpAndFadeAnimation = keyframes({
  '0%': { opacity: 0, transform: 'translateY(10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const slideDownAndFadeAnimation = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

export const content = style({
  paddingInline: tokens.space.sm,
  paddingBlock: tokens.space.xs,
  paddingBottom: `calc(${tokens.space.xs} + 2px)`,
  backgroundColor: tokens.colors.gray1000,
  borderRadius: tokens.radius[1],

  maxWidth: '20rem',
  maxHeight: 'var(--radix-tooltip-content-available-height)',

  animationDuration: '0.6s',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  transformOrigin: 'var(--radix-tooltip-content-transform-origin)',

  selectors: {
    '&[data-side="top"]': {
      animationName: slideUpAndFadeAnimation,
    },

    '&[data-side="bottom"]': {
      animationName: slideDownAndFadeAnimation,
    },
  },
})
