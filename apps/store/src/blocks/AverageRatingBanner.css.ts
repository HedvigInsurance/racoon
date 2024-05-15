import { style } from '@vanilla-extract/css'
import { tokens, minWidth } from 'ui'

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokens.space.xxl,
  aspectRatio: '4 / 5',
  maxWidth: '100%',
  background: `linear-gradient(
    to bottom,
    transparent 0%,
    hsl(84, 96%, 90%) 30%,
    hsl(84, 98%, 90%) 50%,
    hsl(85, 100%, 90%) 70%,
    transparent 100%
  )`,
  paddingBlock: tokens.space[10],
  paddingInline: tokens.space.md,

  '@media': {
    [minWidth.lg]: {
      aspectRatio: '16 / 9',
    },
  },
})

export const averageRatingLabel = style({
  fontSize: 'clamp(5.5rem, 20vw + 1.2rem, 13rem)',
  lineHeight: 1.125,
})

export const disclaimerLabel = style({
  maxWidth: '36rem',
  marginInline: 'auto',
})

export const trigger = style({
  // Fix an issue on safari where the button get's too small when used in a flex context
  flexShrink: 0,
})
