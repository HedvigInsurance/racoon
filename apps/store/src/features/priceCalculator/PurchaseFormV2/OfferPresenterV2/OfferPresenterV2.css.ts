import { style } from '@vanilla-extract/css'
import { responsiveStyles, tokens, yStack } from 'ui'

export const offerPresenterWrapper = style([
  yStack(),
  {
    gap: tokens.space.lg,
    ...responsiveStyles({
      lg: {
        gap: '5rem',
      },
    }),
  },
])

export const tiersWrapper = style([
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
