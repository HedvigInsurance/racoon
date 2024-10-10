import { style } from '@vanilla-extract/css'
import { tokens, xStack } from 'ui'

export const sectionPreview = style([
  xStack({
    alignItems: 'center',
    gap: 'xs',
    paddingBlock: 'sm',
    paddingInline: 'md',
  }),
  {
    backgroundColor: tokens.colors.grayTranslucent100,
    borderRadius: tokens.radius.md,
  },
])

export const editButton = style({
  backgroundColor: tokens.colors.white,
})
