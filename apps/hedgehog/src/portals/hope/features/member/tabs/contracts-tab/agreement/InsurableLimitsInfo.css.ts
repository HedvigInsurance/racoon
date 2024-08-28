import { style } from '@vanilla-extract/css'
import { theme } from '@hedvig-ui/redesign/theme'

export const section = style({
  paddingBottom: theme.space.md,
  borderBottom: `1px solid ${theme.colors.borderTranslucent1}`,
  width: '100%',
})

export const sectionHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.space.xs,
  alignItems: 'center',
  marginBottom: theme.space.xs,
  cursor: 'pointer',
})

export const sectionTitle = style({
  fontSize: '18px',
  margin: '0',
})
