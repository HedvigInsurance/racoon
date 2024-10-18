import { style } from '@vanilla-extract/css'
import { responsiveStyles } from 'ui'
import { HEADER_HEIGHT_DESKTOP } from '@/components/Header/Header.css'

export const gdprLink = style({
  marginTop: '-1rem', // Offset from default gap of 2rem
})

export const ssnSectionWrapper = style({
  ...responsiveStyles({
    lg: {
      display: 'flex',
      justifyContent: 'center',
      // Visually center SSN form section
      marginTop: `calc(-1 * (${HEADER_HEIGHT_DESKTOP} / 2))`,
    },
  }),
})
