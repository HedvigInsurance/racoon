import { style } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'

export const skeletonWrapper = style({
  paddingTop: '3rem', // first heading + padding
})

export const sectionSkeleton = style({
  height: theme.space.xxl,
  width: '100%',
})
