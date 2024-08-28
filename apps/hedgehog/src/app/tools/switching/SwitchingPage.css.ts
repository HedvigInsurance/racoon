import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@hedvig-ui/redesign/theme'

export const eventEmoji = style({
  fontSize: '1.5em',
  cursor: 'default',
})

export const timestamp = style({
  fontFamily: 'monospace',
  fontSize: theme.fontSizes.xs,
  color: theme.colors.textSecondary,
})

export const switcherCaseDetails = style({
  backgroundColor: theme.colors.gray50,
  borderRadius: theme.radius.sm,
})

export const dialog = style({
  width: '400px',
  padding: theme.space.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.sm,
})

globalStyle(`${dialog} textarea`, {
  minHeight: '150px',
})
