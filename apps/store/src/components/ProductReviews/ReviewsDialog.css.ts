import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui/src/theme'
export { dialogContent, dialogCloseBtn, dialogWindow } from './dialogStyles.css'

export const reviewComment = style({
  width: '100%',
})

export const latestReviewsLabel = style({
  paddingInline: themeVars.space.md,
})

export const noReviewsLabel = style({
  paddingInline: themeVars.space.md,
})
