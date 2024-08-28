import { theme } from '@hedvig-ui/redesign/theme'
import { style } from '@vanilla-extract/css'

export const modalWrapper = style({
  padding: '1rem',
  width: '80%',
  height: 'fit-content',
  '@media': {
    'screen and (max-width: 900px)': {
      width: '100%',
    },
  },
})

export const exportTableContent = style({
  borderRadius: theme.radius.sm,
  paddingBottom: theme.space.sm,
  '@media': {
    'screen and (min-height: 900px)': {
      height: '100%',
    },
  },
})

export const cellSubtext = style({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  fontSize: theme.fontSizes.sm,
  color: theme.colors.textTertiary,
})

export const infoText = style({
  color: theme.colors.textPrimary,
  cursor: 'pointer',
  transition: 'all 200ms ease !important',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',

  ':hover': {
    color: theme.colors.textTertiary,
  },
})
