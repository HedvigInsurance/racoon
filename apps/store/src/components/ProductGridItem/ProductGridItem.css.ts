import { createVar, style } from '@vanilla-extract/css'
import { minWidth, tokens, xStack, yStack } from 'ui'

export const card = style([yStack({ gap: 'md' }), { position: 'relative' }])

export const imageAspectRatio = createVar('imageAspectRatio')

export const imageWrapper = style({
  display: 'block',
  position: 'relative',
  marginBottom: tokens.space.md,
  aspectRatio: imageAspectRatio,
  selectors: {
    '&:hover, &:active': {
      opacity: 0.95,
      transition: `opacity ${tokens.transitions.hover}`,
    },
  },
  '@supports': {
    'not (aspect-ratio: auto)': {
      height: '0',
      paddingTop: 'calc((6/5 * 100%))',
      overflow: 'hidden',
    },
  },
})

export const image = style({
  objectFit: 'cover',
  borderRadius: tokens.radius.md,
  '@media': {
    [minWidth.md]: {
      borderRadius: tokens.radius.lg,
    },
  },
})

const CALL_TO_ACTION_HEIGHT = '2.5rem'

export const mainLink = style({
  fontSize: tokens.fontSizes.md,
  selectors: {
    // Make the whole card clickable - CallToAction height
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: CALL_TO_ACTION_HEIGHT,
      left: 0,
    },
  },
})

export const cardLinks = style([
  xStack({ gap: 'sm' }),
  {
    height: CALL_TO_ACTION_HEIGHT,
    marginTop: tokens.space.lg,
  },
])

export const readMoreLink = style({
  selectors: {
    [`${mainLink}:focus-visible ~ ${cardLinks} &`]: {
      boxShadow: tokens.shadow.focus,
    },
  },
})

export const selectInsuranceGrid = style({
  '@media': {
    [minWidth.lg]: {
      paddingTop: '16vh',
    },
    [minWidth.xxl]: {
      paddingTop: '20vh',
    },
  },
})
