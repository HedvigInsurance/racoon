import { style } from '@vanilla-extract/css'
import { tokens, xStack } from 'ui'

export const detailsListRoot = style({
  listStyle: 'none',
  color: tokens.colors.textTranslucentSecondary,
})

export const detailsListItem = style([
  xStack({ justifyContent: 'space-between' }),
  {
    fontSize: 'inherit',
  },
])

export const detailsListLabel = style({
  textAlign: 'start',
})

export const detailsListValue = style({
  textAlign: 'end',
})
