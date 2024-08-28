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
  DropdownMenuContent: style({
    minWidth: '200px',
    padding: theme.space.md,
    borderRadius: theme.radius.md,

    backgroundColor: theme.colors.offWhite,
    boxShadow: theme.shadow.default,

    transformOrigin: 'var(--radix-tooltip-content-transform-origin)',
    animationDuration: '0.3s',
    animationTimingFunction: 'ease-out',

    selectors: {
      '&[data-side="top"]': {
        animationName: slideDownAndFade,
      },
      '&[data-side="right"]': {
        animationName: slideLeftAndFade,
      },
      '&[data-side="bottom"]': {
        animationName: slideUpAndFade,
      },
      '&[data-side="left"]': {
        animationName: slideRightAndFade,
      },
    },
  }),
  DropdownMenuItem: style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    gap: theme.space.md,
    paddingBlock: theme.space.xs,
    paddingInline: theme.space.md,

    borderRadius: theme.radius.sm,
    outline: 'none',

    cursor: 'pointer',

    selectors: {
      '&:hover, &:focus': {
        backgroundColor: theme.colors.translucent2,
      },
    },
  }),
  DropdownSubMenuTrigger: style({
    selectors: {
      '&:hover, &:focus': {
        backgroundColor: theme.colors.translucent1,
        color: 'initial',
      },
      '&[data-state="open"]': {
        backgroundColor: theme.colors.translucent1,
      },
    },
  }),
  rightSlot: style({
    display: 'grid',
    placeItems: 'center',
    marginLeft: 'auto',
    paddingLeft: theme.space.lg,
  }),
}
