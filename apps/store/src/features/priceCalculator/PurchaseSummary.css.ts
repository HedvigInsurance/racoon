import { style } from '@vanilla-extract/css'
import { yStack, responsiveStyles, tokens } from 'ui'
import { CONTENT_MAX_WIDTH } from './PurchaseFormV2.css'

export const actions = style([
  yStack({ gap: 'xs' }),
  {
    position: 'fixed',
    bottom: tokens.space.md,
    width: `min(100%, ${CONTENT_MAX_WIDTH})`,
    marginInline: 'auto',
    ...responsiveStyles({
      lg: {
        position: 'revert',
        width: `max(100%, ${CONTENT_MAX_WIDTH})`,
      },
    }),
  },
])
