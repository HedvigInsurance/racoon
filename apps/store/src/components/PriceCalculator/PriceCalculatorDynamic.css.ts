import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const skeletonWrapper = style({
  paddingTop: '3rem', // first heading + padding
})

export const sectionSkeleton = style({
  height: tokens.space.xxl,
  width: '100%',
})
