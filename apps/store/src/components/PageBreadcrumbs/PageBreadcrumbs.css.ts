import { style } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme/theme.css'

export const breadcrumbsList = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: tokens.space.xxs,
  overflowX: 'auto',
  padding: tokens.space.sm,
  backgroundColor: tokens.colors.opaque2,
  selectors: {
    // Almost the same as justifyContent: 'center',
    // but keeps left alignment when shrunk smaller than content
    '&::before, &::after': {
      content: '""',
      margin: 'auto',
    },
  },
})

export const breadcrumbItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: tokens.space.xxs,
  flexShrink: 0,
})

export const breadcrumbsLink = style({
  fontSize: tokens.fontSizes.sm,
  color: tokens.colors.textPrimary,
  textDecorationColor: 'transparent',
  textDecorationLine: 'underline',
  textDecorationThickness: 'clamp(1px, 0.07em, 2px);',
  textUnderlineOffset: 5,
  '@media': {
    '(hover: hover)': {
      ':hover': {
        textDecorationColor: 'var(--random-hover-color)',
      },
    },
  },
})
