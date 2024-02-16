import { style } from '@vanilla-extract/css'
import { theme, minWidth } from 'ui/src/theme'

export const wrapper = style({
  display: 'inline-flex',
  flexDirection: 'column',
  gap: theme.space.xs,
  padding: theme.space.md,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.opaque1,
  width: 'min(40ch, 100%)',
  minHeight: '8.5rem',

  '@media': {
    [minWidth.md]: {
      padding: theme.space.lg,
      gap: theme.space.md,
    },
  },
})

export const reviewContent = style({
  whiteSpace: 'normal',
})

export const footer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: theme.colors.textTranslucentSecondary,
})
