import { style } from '@vanilla-extract/css'
import { tokens, yStack } from 'ui'

export const wrapper = style([
  yStack({ gap: 'xs' }),
  {
    backgroundColor: tokens.colors.translucent1,
    borderRadius: tokens.radius.sm,
    paddingBlock: tokens.space.sm,
  },
])

export const content = style([
  yStack({ gap: 'xs' }),
  {
    paddingInline: tokens.space.md,
  },
])

export const deleteButton = style({ cursor: 'pointer' })

export const combobox = style({
  paddingInline: tokens.space.sm,
})
