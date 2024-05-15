import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui/src/theme'

export const breadcrumbsList = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: themeVars.space.xxs,
  overflowX: 'auto',
  padding: themeVars.space.sm,
  backgroundColor: themeVars.colors.opaque2,
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
  gap: themeVars.space.xxs,
  flexShrink: 0,
})

export const breadcrumbsLink = style({
  fontSize: themeVars.fontSizes.sm,
  color: themeVars.colors.textPrimary,
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
