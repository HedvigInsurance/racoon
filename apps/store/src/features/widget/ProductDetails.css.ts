import { style } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.space.md,
})

export const listItem = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const documentLink = style({
  fontFamily: theme.fonts.standard,
  fontSize: theme.fontSizes.md,
  lineHeight: '1.6',
  color: theme.colors.textTranslucentSecondary,
  ':hover': { color: theme.colors.textTranslucentPrimary },
  ':focus-visible': {
    boxShadow: theme.shadow.focus,
    borderRadius: theme.space.xxs,
  },
})

export const pdfSup = style({
  verticalAlign: 'super',
  fontSize: '70%',
  lineHeight: 1,
})
