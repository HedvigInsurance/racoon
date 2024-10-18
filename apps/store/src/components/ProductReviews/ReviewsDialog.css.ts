import { style } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme/theme.css'
export { dialogContent, dialogCloseBtn, dialogWindow } from './dialogStyles.css'

export const reviewComment = style({
  width: '100%',
})

export const latestReviewsLabel = style({
  paddingInline: tokens.space.md,
})

export const noReviewsLabel = style({
  paddingInline: tokens.space.md,
})
