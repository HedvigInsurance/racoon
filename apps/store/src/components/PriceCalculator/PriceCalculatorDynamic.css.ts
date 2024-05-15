import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui/src/theme'

export const skeletonWrapper = style({
  paddingTop: '3rem', // first heading + padding
})

export const sectionSkeleton = style({
  height: themeVars.space.xxl,
  width: '100%',
})
