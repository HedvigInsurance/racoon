import { style } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'

export const breadcrumbsList = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: theme.space.xxs,
  overflowX: 'auto',
  padding: theme.space.sm,
  backgroundColor: theme.colors.opaque2,
  selectors: {
    // Almost the same as justifyContent: 'center',
    // but keeps left alignment when shrunk smaller than content
    '&::before, &::after': {
      content: '""',
      margin: 'auto',
    },
    [`body:has(main[data-hide-breadcrumbs=true]) &`]: {
      display: 'none',
    },
  },
})

export const breadcrumbItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xxs,
  flexShrink: 0,
})

export const breadcrumbsLink = style({
  fontSize: theme.fontSizes.sm,
  color: theme.colors.textPrimary,
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
