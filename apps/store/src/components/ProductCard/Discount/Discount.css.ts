import { style } from '@vanilla-extract/css'
import { tokens, xStack } from 'ui'

export const discountForm = style([
  xStack({
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 'sm',
  }),
])

export const formInput = style({
  flex: 1,
  width: '100%',
})

export const formSubmitButton = style({
  position: 'absolute',
  top: tokens.space.sm,
  right: tokens.space.sm,
})
