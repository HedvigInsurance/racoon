import { style } from '@vanilla-extract/css'
import { responsiveStyles, tokens, yStack } from 'ui'
import { HEADER_HEIGHT_DESKTOP } from '@/components/Header/Header.css'
import { HEADER_HEIGHT_MOBILE } from '@/components/Header/HeaderMenuMobile/HeaderMenuMobile.css'

export const PRICE_CALCULATOR_SECTION_PADDING = tokens.space.md

export const pageGrid = style({
  display: 'grid',
  gridTemplateRows: 'min-content 1fr',
  gap: tokens.space.md,
  backgroundColor: tokens.colors.backgroundStandard,
  minHeight: `calc(100vh - ${HEADER_HEIGHT_MOBILE})`,
  ...responsiveStyles({
    lg: {
      gridTemplateColumns: '1fr 1fr',
      minHeight: `calc(100vh - ${HEADER_HEIGHT_DESKTOP})`,
    },
  }),
})

export const productHeroSection = style([
  yStack({ justifyContent: 'center' }),
  {
    height: '13rem',
    alignSelf: 'start',
    paddingInline: tokens.space.md,
    ...responsiveStyles({
      lg: {
        position: 'sticky',
        top: 0,
        minHeight: `calc(100vh - ${HEADER_HEIGHT_DESKTOP})`,
        paddingInline: tokens.space.lg,
      },
    }),
  },
])

export const priceCalculatorSection = style({
  position: 'relative',
  padding: PRICE_CALCULATOR_SECTION_PADDING,
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