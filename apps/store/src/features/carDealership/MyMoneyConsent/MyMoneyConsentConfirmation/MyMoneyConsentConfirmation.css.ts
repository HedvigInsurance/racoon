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
  textAlign: 'center',
  marginBottom: theme.space.lg,
})
