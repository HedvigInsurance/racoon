import { style } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'

export const wrapper = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.xxs,
})

export const trigger = style({
  color: theme.colors.textSecondary,
  fontSize: theme.fontSizes.xs,
  textDecoration: 'underline',
  cursor: 'pointer',

  ':focus-visible': {
    boxShadow: theme.shadow.focus,
  },

  '@media': {
    '(hover: hover)': {
      ':hover': {
        color: theme.colors.textPrimary,
      },
    },
  },
})

export const certifiedIcon = style({
  // Optically align the icon with the text
  marginTop: 1,
})

export const disclaimerText = style({
  paddingInline: theme.space.md,
})
