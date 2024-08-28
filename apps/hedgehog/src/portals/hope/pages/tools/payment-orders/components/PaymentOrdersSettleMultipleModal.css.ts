import { theme } from '@hedvig-ui/redesign/theme'
import { style } from '@vanilla-extract/css'

export const settlePaymentsListItem = style({
  justifyContent: 'space-between',

  // :not :last-of-type
  backgroundColor: theme.colors.gray50,
  borderRadius: theme.radius.sm,
  marginBottom: theme.space.xxs,

  selectors: {
    '&:not(:last-of-type)': {
      paddingBottom: theme.space.sm,
    },
  },
})

export const settlePaymentsListItemTitle = style({
  fontSize: '1rem',
  padding: `0 ${theme.space.sm}`,
})
