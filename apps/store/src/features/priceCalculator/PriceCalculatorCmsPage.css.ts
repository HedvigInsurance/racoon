import { style } from '@vanilla-extract/css'
import { hoverStyles, responsiveStyles, tokens, xStack, yStack } from 'ui'
import { HEADER_HEIGHT_DESKTOP, HEADER_HEIGHT_MOBILE } from '@/components/Header/Header.constants'

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
  yStack(),
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

export const productHero = style({
  marginBlock: 'auto',
  gap: 'xs',
  ...responsiveStyles({ lg: { gap: 'md' } }),
})

export const backLink = style([
  xStack({ gap: 'md', alignItems: 'center' }),
  {
    width: 'min-content',
    height: 'min-content',
    paddingRight: tokens.space.md,
    borderRadius: tokens.radius.xxs,

    ...hoverStyles({
      backgroundColor: tokens.colors.grayTranslucent100,
    }),
  },
])

export const arrowBackWrapper = style({
  transform: 'rotate(180deg)',
  backgroundColor: tokens.colors.grayTranslucent100,
  borderRadius: tokens.radius.xxs,
  padding: tokens.space.xs,
})

export const priceCalculatorSection = style({
  padding: tokens.space.md,
  backgroundColor: tokens.colors.white,
})

export const purchaseFormWrapper = style({
  maxWidth: '23rem',
  marginInline: 'auto',
})
