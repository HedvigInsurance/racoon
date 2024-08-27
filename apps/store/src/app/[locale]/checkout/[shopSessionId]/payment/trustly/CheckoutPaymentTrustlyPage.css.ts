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

export const content = style([
  yStack({ gap: 'lg' }),
  {
    paddingBlock: tokens.space.xxl,
  },
])

export const trustlyIframe = style({
  width: 'min(29rem, 100%)',
  height: 'min(32rem, 60vh)',
})
