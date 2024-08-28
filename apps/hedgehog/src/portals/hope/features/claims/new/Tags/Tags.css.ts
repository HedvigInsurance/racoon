import { theme } from '@hedvig-ui/redesign/theme'
import { style } from '@vanilla-extract/css'

export const tag = style({
  display: 'inline-flex',
  height: '100%',
  gap: theme.space.xxs,
  alignItems: 'center',
  paddingBlock: theme.space.xxs,
  paddingInline: theme.space.xs,
  borderRadius: theme.radius.xs,
  border: '1px solid',
  borderColor: theme.colors.borderTranslucent1,
  cursor: 'pointer',
  backgroundColor: theme.colors.opaque1,

  selectors: {
    '&:hover': {
      opacity: 0.8,
    },
  },
})

export const textArea = style({
  minHeight: '20rem',
})

export const modal = style({
  width: '40rem',
  padding: theme.space.sm,
})
