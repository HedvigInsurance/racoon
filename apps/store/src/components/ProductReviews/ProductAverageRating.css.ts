import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const wrapper = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokens.space.xxs,
})

export const trigger = style({
  color: tokens.colors.textSecondary,
  fontSize: tokens.fontSizes.xs,
  textDecoration: 'underline',
  cursor: 'pointer',

  ':focus-visible': {
    boxShadow: tokens.shadow.focus,
  },

  '@media': {
    '(hover: hover)': {
      ':hover': {
        color: tokens.colors.textPrimary,
      },
    },
  },
})

export const certifiedIcon = style({
  // Optically align the icon with the text
  marginTop: 1,
})

export const disclaimerText = style({
  paddingInline: tokens.space.md,
})
