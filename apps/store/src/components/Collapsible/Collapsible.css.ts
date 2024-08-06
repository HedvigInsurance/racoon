import { style, keyframes } from '@vanilla-extract/css'

const slideDown = keyframes({
  '0%': {
    height: 0,
    overflow: 'hidden',
  },
  '100%': {
    // custom property reference: https://www.radix-ui.com/docs/primitives/components/collapsible
    height: 'var(--radix-collapsible-content-height)',
    overflow: 'initial',
  },
})

const slideUp = keyframes({
  '0%': {
    height: 'var(--radix-collapsible-content-height)',
    overflow: 'hidden',
  },
  '100%': {
    height: 0,
    overflow: 'hidden',
  },
})

export const trigger = style({
  cursor: 'pointer',
})

export const content = style({
  selectors: {
    '&[data-state=open]': {
      animation: `${slideDown} 400ms cubic-bezier(0.65,0.05,0.36,1)`,
    },
    '&[data-state=closed]': {
      animation: `${slideUp} 400ms cubic-bezier(0.65,0.05,0.36,1)`,
    },
  },
})
