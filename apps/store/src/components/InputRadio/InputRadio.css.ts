import { style } from '@vanilla-extract/css'
import { tokens, yStack, xStack } from 'ui'

export const card = style([
  yStack({ gap: 'xs' }),
  {
    paddingBlock: tokens.space.sm,
    paddingInline: tokens.space.md,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.colors.translucent1,
  },
])

export const option = style([
  xStack({ gap: 'xs', alignItems: 'center' }),
  {
    cursor: 'pointer',
  },
])

export const item = style({
  width: '1.5rem',
  aspectRatio: '1 / 1',
  borderRadius: '50%',
  cursor: 'pointer',
  selectors: {
    '&[data-state=checked]': {
      borderColor: tokens.colors.gray1000,
    },

    '&:focus-visible': {
      boxShadow: tokens.shadow.focusAlt,
    },
  },
})

export const horizontalRoot = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: tokens.space.xxs,
})

export const horizontalItem = style({
  cursor: 'pointer',
  padding: `${tokens.space.sm} ${tokens.space.md}`,
  borderRadius: tokens.radius.sm,
  backgroundColor: tokens.colors.translucent1,
})
