import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui/src/theme'

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  rowGap: themeVars.space.md,
})

export const listItem = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const documentLink = style({
  fontFamily: themeVars.fonts.standard,
  fontSize: themeVars.fontSizes.md,
  lineHeight: '1.6',
  color: themeVars.colors.textTranslucentSecondary,
  ':hover': { color: themeVars.colors.textTranslucentPrimary },
  ':focus-visible': {
    boxShadow: themeVars.shadow.focus,
    borderRadius: themeVars.space.xxs,
  },
})

export const pdfSup = style({
  verticalAlign: 'super',
  fontSize: '70%',
  lineHeight: 1,
})
