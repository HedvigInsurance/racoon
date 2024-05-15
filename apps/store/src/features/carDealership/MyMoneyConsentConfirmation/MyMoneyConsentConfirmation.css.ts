import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const consentDialogContent = style({
  width: '100%',
  alignSelf: 'center',
})

export const consentDialogWindow = style({
  padding: tokens.space.md,
  paddingTop: tokens.space.xl,
  borderRadius: tokens.radius.xxs,
  width: `calc(100% - ${tokens.space.xs} * 2)`,
  maxWidth: '24rem',
  marginInline: 'auto',
})

export const consentDialogMessage = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  marginBottom: tokens.space.lg,
})

export const consentDialogIcon = style({
  color: tokens.colors.signalBlueElement,
  marginBottom: tokens.space.md,
})
