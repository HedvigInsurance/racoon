import { style, styleVariants } from '@vanilla-extract/css'
import { tokens, yStack, xStack } from 'ui'

export const horizontalRadioGroup = styleVariants({
  withLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.space.md,
  },
  withoutLabel: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.space.xxs,
  },
})

export const card = style([
  yStack({ gap: 'xs' }),
  {
    paddingBlock: tokens.space.sm,
    paddingInline: tokens.space.md,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.colors.translucent1,
  },
])

export const radioButton = style({
  borderRadius: '50%',
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      boxShadow: tokens.shadow.focusAlt,
    },
  },
})

export const item = style([
  xStack({ gap: 'xs', alignItems: 'center' }),
  {
    cursor: 'pointer',
  },
])

export const paddedItem = style({
  padding: `${tokens.space.sm} ${tokens.space.md}`,
  borderRadius: tokens.radius.sm,
  backgroundColor: tokens.colors.translucent1,
})
