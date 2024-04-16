import { style } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'
export { dialogContent, dialogCloseBtn, dialogWindow } from './dialogStyles.css'

export const reviewComment = style({
  width: '100%',
})

export const latestReviewsLabel = style({
  paddingInline: theme.space.md,
})

export const noReviewsLabel = style({
  paddingInline: theme.space.md,
})
