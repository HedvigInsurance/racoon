import { keyframes, style, styleVariants } from '@vanilla-extract/css'
import { animationAllowed, tokens } from '../../theme'

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

export const overlay = styleVariants({
  base: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    position: 'fixed',
    inset: 0,
    '@media': {
      [animationAllowed]: {
        animation: `${overlayShow} 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
      },
    },
  },
  frosted: {
    backgroundColor: tokens.colors.backgroundFrostedGlass,
    backdropFilter: 'blur(64px)',
  },
})

export const contentWrapper = styleVariants({
  base: {
    position: 'fixed',
    inset: 0,
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    overflowY: 'auto',
  },
})

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'scale(.96)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
})

export const dialogWindow = style({
  backgroundColor: tokens.colors.white,
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  '@media': {
    [animationAllowed]: {
      animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
    },
  },
})
