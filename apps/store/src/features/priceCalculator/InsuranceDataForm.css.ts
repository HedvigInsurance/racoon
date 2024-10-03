import { style, styleVariants } from '@vanilla-extract/css'
import { responsiveStyles } from 'ui'
import { HEADER_HEIGHT_DESKTOP } from '@/components/Header/Header.css'
import { PRICE_CALCULATOR_SECTION_PADDING } from './PriceCalculatorCmsPageContent.css'

export const gdprLink = style({
  marginTop: '-1rem', // Offset from default gap of 2rem
})

export const formSection = styleVariants({
  base: {
    marginTop: '3.75rem',
  },
  ssn: {
    ...responsiveStyles({
      lg: {
        position: 'absolute',
        top: `50%`,
        transform: `translateY(-50%)`,
        width: `min(23rem, calc(100% - 2 * ${PRICE_CALCULATOR_SECTION_PADDING}))`,
        // Visually center SSN form section
        marginTop: `calc(-1 * (${HEADER_HEIGHT_DESKTOP} / 2))`,
      },
    }),
  },
})
