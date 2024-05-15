import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui'

export const consentDialogContent = style({
  width: '100%',
  alignSelf: 'center',
})

export const consentDialogWindow = style({
  padding: themeVars.space.md,
  paddingTop: themeVars.space.xl,
  borderRadius: themeVars.radius.xxs,
  width: `calc(100% - ${themeVars.space.xs} * 2)`,
  maxWidth: '24rem',
  marginInline: 'auto',
})

export const consentDialogMessage = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  marginBottom: themeVars.space.lg,
})

export const consentDialogIcon = style({
  color: themeVars.colors.signalBlueElement,
  marginBottom: themeVars.space.md,
})
