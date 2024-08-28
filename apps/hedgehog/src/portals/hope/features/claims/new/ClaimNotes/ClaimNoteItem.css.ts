import { style } from '@vanilla-extract/css'
import { theme } from '@hedvig-ui/redesign/theme'

export const noteItem = style({
  selectors: {
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${theme.colors.borderTranslucent1}`,
    },
  },
})

export const noteText = style({
  margin: '0',
  whiteSpace: 'pre-wrap',
})

export const creatorInfo = style({
  display: 'flex',
  alignSelf: 'flex-start',
  marginLeft: 'auto',
  flexDirection: 'column',
  fontSize: '12px',
  color: theme.colors.textSecondary,
  textAlign: 'right',
  flexShrink: 0,
})
