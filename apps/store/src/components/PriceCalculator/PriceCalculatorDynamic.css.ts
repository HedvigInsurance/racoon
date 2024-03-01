import { style } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'

export const sectionSkeleton = style({
  height: theme.space.xxl,
  width: '100%',
  selectors: {
    '&:first-child': {
      marginTop: theme.space.md,
    },
  },
})
