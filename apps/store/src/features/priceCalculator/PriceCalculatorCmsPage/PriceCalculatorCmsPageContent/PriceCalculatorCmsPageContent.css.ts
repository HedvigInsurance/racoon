import { style } from '@vanilla-extract/css'
import { responsiveStyles, sprinkles, tokens } from 'ui'
import { HEADER_HEIGHT_DESKTOP } from '@/components/Header/Header.css'
import { HEADER_HEIGHT_MOBILE } from '@/components/Header/HeaderMenuMobile/HeaderMenuMobile.css'

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
  sprinkles({ display: 'flex', flexDirection: 'column', justifyContent: 'center' }),
  {
    ...responsiveStyles({
      lg: {
        position: 'sticky',
        top: 0,
        gridColumn: '1 / span 7',
        alignSelf: 'start',
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
