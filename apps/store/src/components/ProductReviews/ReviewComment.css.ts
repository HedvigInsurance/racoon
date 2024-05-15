import { style } from '@vanilla-extract/css'
import { tokens, minWidth } from 'ui'

export const wrapper = style({
  display: 'inline-flex',
  flexDirection: 'column',
  gap: tokens.space.xs,
  padding: tokens.space.md,
  borderRadius: tokens.radius.md,
  backgroundColor: tokens.colors.opaque1,
  width: 'min(40ch, 100%)',
  minHeight: '8.5rem',

  '@media': {
    [minWidth.md]: {
      padding: tokens.space.lg,
      gap: tokens.space.md,
    },
  },
})

export const reviewHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: tokens.space.xs,
})

export const reviewContent = style({
  whiteSpace: 'normal',
})

export const reviewFooter = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: tokens.colors.textTranslucentSecondary,
})

export const reviewTag = style({
  fontSize: tokens.fontSizes.xs,
  paddingBlock: tokens.space.xxs,
  paddingInline: tokens.space.xs,
  borderRadius: tokens.radius.xs,
  backgroundColor: tokens.colors.backgroundStandard,
})
