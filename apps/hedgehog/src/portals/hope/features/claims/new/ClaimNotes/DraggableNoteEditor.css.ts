import { theme } from '@hedvig-ui/redesign/theme'
import { style } from '@vanilla-extract/css'

export const noteEditorWrapper = style({
  minWidth: '800px',
  position: 'absolute',
  bottom: 'calc(100% + 1rem)',
  right: '0',
  background: theme.colors.offWhite,
  padding: theme.space.sm,
  boxShadow: theme.shadow.default,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.borderOpaque1}`,
  cursor: 'grab',

  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.xs,
})
