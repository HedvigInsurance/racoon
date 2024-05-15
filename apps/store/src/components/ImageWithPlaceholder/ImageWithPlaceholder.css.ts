import { styleVariants } from '@vanilla-extract/css'
import { themeVars } from 'ui/src/theme'

export const imageStyles = styleVariants({
  base: {
    backgroundColor: themeVars.colors.gray100,
  },
  loaded: {
    backgroundColor: 'transparent',
  },
})
