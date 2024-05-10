import { createVar, globalStyle } from '@vanilla-extract/css'

export const navigationProgressColor = createVar()

globalStyle('#nprogress .bar', {
  background: navigationProgressColor,
})

globalStyle('#nprogress .peg', {
  boxShadow: `0 0 10px ${navigationProgressColor}, 0 0 5px ${navigationProgressColor}`,
})
