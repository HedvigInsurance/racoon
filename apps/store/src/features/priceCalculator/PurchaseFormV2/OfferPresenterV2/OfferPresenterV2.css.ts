import { style } from '@vanilla-extract/css'
import { responsiveStyles, tokens, yStack } from 'ui'

export const offerPresenterWrapper = style([
  yStack(),
  {
    gap: '5rem',
    ...responsiveStyles({
      lg: {
        paddingBottom: tokens.space[9],
      },
    }),
  },
])
