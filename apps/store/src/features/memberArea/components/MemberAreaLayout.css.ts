import { style } from '@vanilla-extract/css'
import { responsiveStyles, tokens, xStack, yStack } from 'ui'

export const layoutWrapper = style({
  minHeight: '100vh',
  isolation: 'isolate',
})

export const main = style({
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
  width: '100%',
  marginInline: 'auto',
  paddingBottom: tokens.space.xxl,
  ...responsiveStyles({
    lg: {
      paddingTop: `5rem`,
      gridTemplateColumns: '18rem 1fr 18rem',
      gridTemplateRows: 'auto',
    },
  }),
})

export const CONTENT_WIDTH = '28.5rem'

export const contentSkeleton = style({
  width: '100%',
  maxWidth: CONTENT_WIDTH,
  aspectRatio: '343/182',
})

export const loadingWrapper = style([
  yStack({ gap: 'lg' }),
  {
    width: '100%',
    maxWidth: CONTENT_WIDTH,
    marginInline: 'auto',
  },
])

export const content = style([
  xStack({ justifyContent: 'center' }),
  {
    width: '100%',
    marginInline: 'auto',
    paddingInline: tokens.space.md,
  },
])
