import { createVar } from '@vanilla-extract/css'
import { responsiveVariants } from '../../utils/responsiveVariants/responsiveVariants'

export const pillowSize = createVar('pillowSize')

export const pillowSizeStyles = responsiveVariants({
  base: {
    width: pillowSize,
    height: pillowSize,
  },
  variants: {
    mini: {
      vars: { [pillowSize]: '1.5rem' },
    },
    xxsmall: {
      vars: { [pillowSize]: '1.75rem' },
    },
    xsmall: {
      vars: { [pillowSize]: '2rem' },
    },
    small: {
      vars: { [pillowSize]: '3rem' },
    },
    medium: {
      vars: { [pillowSize]: '3.5rem' },
    },
    large: {
      vars: { [pillowSize]: '5rem' },
    },
    xlarge: {
      vars: { [pillowSize]: '6rem' },
    },
    xxlarge: {
      vars: { [pillowSize]: '13rem' },
    },
  },
})
