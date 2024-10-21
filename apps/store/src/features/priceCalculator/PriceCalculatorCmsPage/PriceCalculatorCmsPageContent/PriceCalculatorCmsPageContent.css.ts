import { style } from '@vanilla-extract/css'
import { responsiveStyles, tokens, yStack } from 'ui'
import { HEADER_HEIGHT_DESKTOP } from '@/components/Header/Header.css'
import { HEADER_HEIGHT_MOBILE } from '@/components/Header/HeaderMenuMobile/HeaderMenuMobile.css'
import { CONTENT_MAX_WIDTH } from '@/features/priceCalculator/PurchaseFormV2/PurchaseFormV2.css'

// Offset for fixed formFooter
export const FORM_FOOTER = '7rem'

export const pageGrid = style({
  display: 'grid',
  gridTemplateRows: `min-content 1fr ${FORM_FOOTER}`,
  columnGap: tokens.space.md,
  maxWidth: tokens.width.layoutMax,
  minHeight: `calc(100vh - ${HEADER_HEIGHT_MOBILE})`,
  marginInline: 'auto',
  paddingInline: tokens.space.md,
  backgroundColor: tokens.colors.backgroundStandard,

  ...responsiveStyles({
    lg: {
      gridTemplateRows: 'auto',
      gridTemplateColumns: 'repeat(14, 1fr)',
      minHeight: `calc(100vh - ${HEADER_HEIGHT_DESKTOP})`,
      paddingInline: tokens.space.lg,
    },
  }),
})

export const productHeroSection = style([
  yStack({ justifyContent: 'center' }),
  {
    height: '13rem',
    alignSelf: 'start',

    ...responsiveStyles({
      lg: {
        position: 'sticky',
        top: 0,
        gridColumn: '1 / span 7',
        minHeight: `calc(100vh - ${HEADER_HEIGHT_DESKTOP})`,
      },
    }),
  },
])

export const priceCalculatorSection = style({
  position: 'relative',

  ...responsiveStyles({
    lg: {
      gridColumn: '9 / span 4',
    },
  }),
})

export const productHero = style({
  display: 'flex',
  gap: tokens.space.xs,

  ...responsiveStyles({
    lg: {
      gap: tokens.space.md,
      // Visually center Product Hero
      marginTop: `calc(-1 * ${HEADER_HEIGHT_DESKTOP})`,
    },
  }),
})

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
