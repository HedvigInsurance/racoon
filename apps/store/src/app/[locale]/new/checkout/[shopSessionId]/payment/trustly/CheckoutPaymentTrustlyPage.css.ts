import { style } from '@vanilla-extract/css'
import { tokens, yStack } from 'ui'

export const successState = style([
  yStack({
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'lg',
  }),
  {
    height: '100vh',
  },
])

export const content = style({
  paddingBlock: tokens.space.xxl,
})
