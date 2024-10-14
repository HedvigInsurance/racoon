import { style } from '@vanilla-extract/css'
import { yStack, responsiveStyles } from 'ui'

export const CONTENT_MAX_WIDTH = '23rem'

export const centered = style({
  maxWidth: CONTENT_MAX_WIDTH,
  marginInline: 'auto',
  ...responsiveStyles({
    lg: {
      width: `max(${CONTENT_MAX_WIDTH}, 100%)`,
      maxWidth: 'unset',
      height: '100%',
    },
  }),
})

export const priceLoaderWrapper = style([
  yStack({ justifyContent: 'center', gap: 'md' }),
  centered,
  {
    ...responsiveStyles({
      lg: { height: '75vh' },
    }),
  },
])

export const viewOffersWrapper = style([yStack(), centered, { gap: '2.75rem' }])

export const purchaseSummaryWrapper = style([
  yStack({ alignItems: 'center', justifyContent: 'center' }),
  { height: '100%' },
])

export const purchaseSummary = style({
  width: `min(100%, ${CONTENT_MAX_WIDTH})`,
  marginInline: 'auto',
  ...responsiveStyles({
    lg: {
      width: `max(100%, ${CONTENT_MAX_WIDTH})`,
    },
  }),
})
