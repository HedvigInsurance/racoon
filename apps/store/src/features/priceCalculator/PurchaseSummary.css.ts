import { style } from '@vanilla-extract/css'
import { yStack, responsiveStyles, tokens } from 'ui'
import { CONTENT_MAX_WIDTH } from './PurchaseFormV2.css'

export const actions = style([
  yStack({ gap: 'xs' }),
  {
    position: 'fixed',
    bottom: tokens.space.md,
    width: `calc(100% - ${tokens.space.md} * 2)`,
    maxWidth: CONTENT_MAX_WIDTH,
    ...responsiveStyles({
      lg: {
        position: 'revert',
        width: '100%',
      },
    }),
  },
])
