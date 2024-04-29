import { style } from '@vanilla-extract/css'
import { theme } from 'ui'

export const consentDialogContent = style({
  width: '100%',
  alignSelf: 'center',
})

export const consentDialogWindow = style({
  padding: theme.space.md,
  paddingTop: theme.space.xl,
  borderRadius: theme.radius.xxs,
  width: `calc(100% - ${theme.space.xs} * 2)`,
  maxWidth: '24rem',
  marginInline: 'auto',
})

export const consentDialogMessage = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  marginBottom: theme.space.lg,
})

export const consentDialogIcon = style({
  color: theme.colors.signalBlueElement,
  marginBottom: theme.space.md,
})
