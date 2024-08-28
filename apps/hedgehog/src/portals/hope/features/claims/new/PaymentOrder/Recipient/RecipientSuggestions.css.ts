import { style } from '@vanilla-extract/css'
import { theme } from '@hedvig-ui/redesign/theme'

export const wrapper = style({
  zIndex: 2,
  position: 'absolute',
  top: '100%',
  marginTop: theme.space.xs,

  width: '100%',
  maxHeight: '300px',
  overflowY: 'scroll',
  padding: theme.space.md,
  borderRadius: theme.radius.sm,

  background: theme.colors.offWhite,
  boxShadow: theme.shadow.default,

  selectors: {
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
  },
})

export const suggestionRow = style({
  cursor: 'pointer',

  display: 'flex',
  justifyContent: 'space-between',

  paddingBlock: theme.space.xs,
  paddingInline: theme.space.md,
  borderRadius: theme.radius.sm,

  selectors: {
    '&:hover': {
      backgroundColor: theme.colors.translucent1,
    },
  },
})

export const muted = style({
  color: theme.colors.textSecondary,
})
