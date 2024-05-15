import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui/src/theme'

export const wrapper = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: themeVars.space.xxs,
})

export const trigger = style({
  color: themeVars.colors.textSecondary,
  fontSize: themeVars.fontSizes.xs,
  textDecoration: 'underline',
  cursor: 'pointer',

  ':focus-visible': {
    boxShadow: themeVars.shadow.focus,
  },

  '@media': {
    '(hover: hover)': {
      ':hover': {
        color: themeVars.colors.textPrimary,
      },
    },
  },
})

export const certifiedIcon = style({
  // Optically align the icon with the text
  marginTop: 1,
})

export const disclaimerText = style({
  paddingInline: themeVars.space.md,
})
