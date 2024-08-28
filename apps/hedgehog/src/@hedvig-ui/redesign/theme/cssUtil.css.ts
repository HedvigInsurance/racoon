import { style } from '@vanilla-extract/css'
import { theme } from '@hedvig-ui/redesign/theme'

const rotatable = style({
  rotate: '0deg',
  transition: 'rotate 200ms ease-in-out',
})

const rotated180 = style({
  rotate: '180deg',
  transition: 'rotate 200ms ease-in-out',
})

const pointer = style({ cursor: 'pointer' })

const textHighlight = style({ backgroundColor: theme.colors.yellow600 })

const textMuted = style({
  color: theme.colors.textSecondary,
})

const textSmaller = style({
  fontSize: theme.fontSizes.xs,
})

const textLink = style({
  cursor: 'pointer',
  color: theme.colors.textPrimary,

  selectors: {
    '&:hover': {
      color: theme.colors.textSecondary,
      textDecoration: 'underline',
    },
  },
})

const tableCard = style({
  padding: 0,
  overflow: 'clip',
})

const tableCardTitle = style({
  height: '64px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingInline: theme.space.md,
})

const columnSubText = style({
  fontSize: theme.fontSizes.xxs,
  color: theme.colors.textSecondary,
})

export const cssUtil = {
  rotatable,
  rotated180,
  pointer,
  textHighlight,
  textMuted,
  textSmaller,
  textLink,
  tableCard,
  tableCardTitle,
  columnSubText,
}
