import { style } from '@vanilla-extract/css'
import { yStack, responsiveStyles } from 'ui'

const CONTENT_MAX_WIDTH = '23rem'

export const centered = style({
  maxWidth: CONTENT_MAX_WIDTH,
  marginInline: 'auto',
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
  width: `min(${CONTENT_MAX_WIDTH}, 100%)`,
})
