import { styleVariants } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const imageStyles = styleVariants({
  base: {
    backgroundColor: tokens.colors.gray100,
  },
  loaded: {
    backgroundColor: 'transparent',
  },
})
