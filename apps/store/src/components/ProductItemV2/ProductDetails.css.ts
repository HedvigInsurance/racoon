import { style } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme/theme.css'

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  rowGap: tokens.space.md,
})

export const listItem = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const documentLink = style({
  fontFamily: tokens.fonts.standard,
  fontSize: tokens.fontSizes.md,
  lineHeight: '1.6',
  color: tokens.colors.textTranslucentSecondary,
  ':hover': { color: tokens.colors.textTranslucentPrimary },
  ':focus-visible': {
    boxShadow: tokens.shadow.focus,
    borderRadius: tokens.space.xxs,
  },
})

export const pdfSup = style({
  verticalAlign: 'super',
  fontSize: '70%',
  lineHeight: 1,
})
