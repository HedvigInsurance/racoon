import { styleVariants } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'

export const imageStyles = styleVariants({
  base: {
    backgroundColor: theme.colors.gray100,
  },
  loaded: {
    backgroundColor: 'transparent',
  },
})
